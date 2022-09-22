const express = require('express');
const router = express.Router();
const member = require('../models/member');
const jwt = require('../config/jwt');
const bcrypt = require("bcrypt");
const secretKey = require('../config/secretKey').secretKey;
const noLogin = require('../middlewares/noLogin').checkToken;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그인 ejs 렌더링
 * 주요 기능 : 로그인 ejs 렌더링
 */
router.get('/', noLogin, function (req, res, next) {
    res.render('login');
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그인 기능 API
 * 주요 기능 : 로그인 유효성 검사후 에러 메세지 처리 및 성공
 */
router.post('/', async function (req, res) {
    let req_emp_no = req.body.emp_no;
    let req_password = req.body.password;

    /** 로그인 아이디를 find하여 비밀번호 검증 후 로그인 처리 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그아웃 기능 API
 * 주요 기능 : 로그아웃시 토큰 쿠키 삭제
 */
router.get('/logout', async function (req, res) {
    res.clearCookie('token').json({message: "로그아웃 되었습니다."});
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 가지고있는 토큰의 만료시간을 계산해주는 함수
 * 주요 기능 : 토큰을 decode 하여 만료시간데이터를 가공하여 response
 */
router.get('/exp', async function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decode = await jwt.verify(token, secretKey);
    let currunt_time = new Date();
    currunt_time = Math.floor(currunt_time / 1000);
    const time = decode.exp - currunt_time;
    res.json({time: time});
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 토큰 연장 기능을 으로 access토큰 재발급
 * 주요 기능 : 토큰 발급 함수를 재실행 후 재 만료시간 response
 */
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