const express = require('express');
const router = express.Router();
const member = require('../models/member');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');

// aws 설정 루트
AWS.config.loadFromPath(__dirname + "/../config/awsConfig.json");

/**
 * 담당자 : 박신욱
 * 함수 설명 : 이메일 인증
 * 주요 기능 : 이메일 params를 설정해 메일을 보내는기능
 * 인증번호를 난수화하여 bcrypt모듈로 암호화 후 3분의 유효기간을 두어 쿠키 저장
 */
router.post('/email', async function (req, res) {
    try {
        await member.findOne({email: req.body.email}).exec((err, result)=>{
            if(result){
                return res.json({
                    message: "이미등록된 이메일 입니다."
                })
            }else{
                let number = Math.floor(Math.random() * 1000000) + 100000;
                if (number > 1000000) {
                    number -= 100000;
                }
                let ses = new AWS.SES();
                let params = {
                    Destination: { /* required */
                        ToAddresses: [
                            req.body.email,
                        ]
                    },
                    Message: { /* required */
                        Body: { /* required */
                            Text: {
                                Charset: "UTF-8",
                                Data: `인증번호는 ${number} 입니다.`
                            }
                        },
                        Subject: {
                            Charset: 'UTF-8',
                            Data: '흥부 물품 회원가입 인증번호'
                        }
                    },
                    Source: 'asad0922@gmail.com', /* required */
                    ReplyToAddresses: [
                        'asad0922@gmail.com',
                        /* more items */
                    ],
                };
                ses.sendEmail(params, function (err, result) {
                    if (err) {
                        return res.json({message: "인증번호 요청에 실패하였습니다."});
                    }
                    number = number.toString();
                    const hashNum = bcrypt.hashSync(number, 12);
                    return res.cookie('authNum', hashNum, {
                        maxAge: 180000
                    }).json({message: "인증번호를 요청하였습니다."})
                })
            }
        })
    } catch (err) {
        return res.send(err);
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메일 인증번호 검증 기능
 * 주요 기능 : 쿠키에 암호화로 저장된 인증번호와 사용자가 입력한 인증번호가 일치하는지 유효성 검사하는 기능
 */
router.post('/email/success', function (req, res) {
    const authNum = req.cookies.authNum;
    const CEA = req.body.CEA;
    try {
        if (bcrypt.compareSync(CEA, authNum)) {
            res.json({result: true})
        } else {
            res.json({result: false})
        }
    } catch (err) {
        res.send(err);
    }
})

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

module.exports = router;