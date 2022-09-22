const express = require('express');
const router = express.Router();
const member = require('../models/member')

/**
 * 담당자 : 박신욱
 * 함수 설명 : 이용자관리 ejs 렌더링
 * 주요 기능 : 이용자 관리의 초기 데이터 response
 */
router.get('/', async function (req, res, next) {
    const data = await member.find().exec();
    res.render('manageUser', {stateUrl: 'manageUser', data: data});
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 이용자관리 권한 회수 및 부여
 * 주요 기능 : req로받은 데이터를 통해 사용자 컬렉션을 업데이트 후 변경된 사용자 데이터 response
 */
router.patch('/', async function (req, res) {
    try {
        const update = await member.update({emp_no: req.body.emp_no},
            {
                edit_auth: req.body.edit_auth,
                rent_auth: req.body.rent_auth,
                open_auth: req.body.open_auth
            });
        const data = await member.findOne({emp_no: req.body.emp_no}).exec()
        res.status(201).json(data);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 이용자 관리 비밀번호 초기화 API
 * 주요 기능 : 0405로 비밀번호 초기화 기능
 */
router.patch('/init', async function (req, res) {
    try {
        const update = await member.findOneAndUpdate({emp_no: req.body.emp_no},
            {
                password: '0405',
            })
        res.status(201).json({message: '초기화 성공'});
    } catch {
        res.status(400).json({message: err.message});
    }
})


/**
 * 담당자 : 박신욱
 * 함수 설명 : 이용자관리의 이용자 검색 API
 * 주요 기능 : req로 받아온 데이터로 select된 데이터별로 사용자 컬렉션 find 후 response
 */
router.post('/search', async function (req, res) {
    let condition = req.body.condition;
    let text = req.body.text;
    let members = new member;
    try {
        if (condition == "emp_name") {
            members = await member.find({emp_name: {$regex: text}})

        }else if(condition == "emp_no") {
            members = await member.find({emp_no: {$regex: text}})
        }else if(condition == "dept") {
            members = await member.find({dept: {$regex: text}})
        }else if(condition == "emp_position") {
            members = await member.find({emp_position: {$regex: text}})
        }
        return res.status(201).json({data: members});
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
})

module.exports = router;
