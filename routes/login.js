const express = require('express');
const router = express.Router();
const member = require('../models/member');
const jwt = require('../config/jwt');
const bcrypt = require("bcrypt");

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
    //res.render('testPage');
});

// 로그인
router.post('/',  async function(req, res) {
    let req_emp_no = req.body.emp_no;
    let req_password = req.body.password;

    member.findOne({ emp_no: req_emp_no }).exec(async (err, result) => {
        if (result) {
            if (bcrypt.compareSync(req_password, result.password)) {
                const jwtToken = await jwt.sign(result);
                res.status(201).json({token : jwtToken.token});
            } else {
                res.send("비밀 번호가 틀렸습니다.");
            }
        } else {
            res.send("없는 아이디 입니다.");
        }
    });
});

// access토큰 재발급
router.post('/token', function(req, res) {
    let req_emp_no = req.body.emp_no;

    member.findOne({ emp_no: req_emp_no }).exec(async (err, result) => {
        const jwtToken = await jwt.sign(result);
        res.status(201).json({token : jwtToken.token});
    })
})

module.exports = router;