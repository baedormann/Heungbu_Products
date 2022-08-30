const express = require('express');
const router = express.Router();
const member = require('../models/member');
const bcrypt = require("bcrypt");

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
    //res.render('testPage');
});

// 로그인
router.post('/', async function(req, res) {
    let req_emp_no = req.body.emp_no;
    let req_password = req.body.password;

    await member.findOne({ emp_no: req_emp_no }).exec((err, result) => {
        if(result) {
                if(bcrypt.compareSync(req_password, result.password)){
                    res.send("로그인 성공");
                }else{
                    res.send("비밀 번호가 틀렸습니다.");
                }
        } else {
            res.send("없는 아이디 입니다.");
        }
    });
});



module.exports = router;