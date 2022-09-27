const express = require('express');
const router = express.Router();
const member = require('../models/member');
const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + "/../config/awsConfig.json");

/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입 ejs 랜더링
 * 주요 기능 : 회원가입 ejs 랜더링
 */
router.get('/', function (req, res, next) {
    res.render('auth');
});


/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입 회원등록 API
 * 주요 기능 : 회원가입 회원 정보를 가져와 회원 등록 기능
 */
router.post('/', async function (req, res) {
    try {
        /** req로 받은 데이터로 새로운 사용자 객체 생성 */
        const data = new member({
            emp_no: req.body.emp_no,
            password: req.body.password,
            emp_name: req.body.emp_name,
            dept: req.body.dept,
            emp_position: req.body.emp_position,
            email: req.body.email,
            authority: req.body.authority
        });
        /** 중복된 사용자 유효성 검사 후 중복된 사번이 아닐경우 회원 등록 */
        await member.findOne({emp_no: data.emp_no}).exec(async (err, result) => {
            if (result) {
                return res.status(400).json({message: "이미 가입된 사번입니다."});
            } else {
                const newMember = await data.save();
                console.log(data.emp_no + "님이 회원가입 하셨습니다.");
                return res.status(201).json({data: newMember, message: "회원가입에 성공하셨습니다."});
            }
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

router.post('/email', function (req, res){
    let ses = new AWS.SES();
    let params = {
        Destination: { /* required */
            ToAddresses: [
                'asad0922@gmail.com',
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Text: {
                    Charset: "UTF-8",
                    Data: "인증번호입니다."
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: '인증번호'
            }
        },
        Source: 'asad0922@gmail.com', /* required */
        ReplyToAddresses: [
            'asad0922@gmail.com',
            /* more items */
        ],
    };
    ses.sendEmail(params, function (err, result){
        if(err){
            res.send(err);
        }
        res.send(result)
    })
})

module.exports = router;