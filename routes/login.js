const express = require('express');
const router = express.Router();
const member = require('../models/member');
const jwt = require('../config/jwt');
const bcrypt = require("bcrypt");
const secretKey = require('../config/secretKey').secretKey;
const noLogin = require('../middlewares/noLogin').checkToken;

/* GET login page. */
router.get('/', noLogin, function (req, res, next) {
    res.render('login');
});

// 로그인
router.post('/', async function (req, res) {
    let req_emp_no = req.body.emp_no;
    let req_password = req.body.password;

    member.findOne({emp_no: req_emp_no}).exec(async (err, result) => {
        if (result) {
            if (bcrypt.compareSync(req_password, result.password)) {
                const jwtToken = await jwt.sign(result);
                res.cookie("token", jwtToken.token).status(200).json({message: "로그인 성공", data: result});
            } else {
                res.send({message: "로그인 정보가 일치하지 않습니다."});
            }
        } else {
            res.send({message: "로그인 정보가 일치하지 않습니다."});
        }
    });
});

// 로그아웃
router.get('/logout', async function (req, res) {
    res.clearCookie('token').json({message: "로그아웃 되었습니다."});
})

// 만료시간
router.get('/exp', async function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decode = await jwt.verify(token, secretKey);
    let currunt_time = new Date();
    currunt_time = Math.floor(currunt_time / 1000);
    const time = decode.exp - currunt_time;
    res.json({time: time});
})

// access토큰 재발급
router.post('/token', async function (req, res) {
    let req_emp_no = req.body.emp_no;
    member.findOne({emp_no: req_emp_no}).exec(async (err, result) => {
        const jwtToken = await jwt.sign(result);
        const decode = await jwt.verify(jwtToken.token, secretKey);
        let currunt_time = new Date();
        currunt_time = Math.floor(currunt_time / 1000);
        const time = decode.exp - currunt_time;
        res.cookie("token", jwtToken.token).status(201).json({message: "연장 성공", time: time});
    })
})

module.exports = router;