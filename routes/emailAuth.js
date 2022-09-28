const express = require('express');
const router = express.Router();

/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입 ejs 랜더링
 * 주요 기능 : 회원가입 ejs 랜더링
 */
router.get('/', function (req, res, next) {
    res.render('emailAuth');
});

module.exports = router;