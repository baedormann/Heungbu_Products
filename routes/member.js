const express = require('express');
const router = express.Router();
const member = require('../models/member')

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자와 관련된 전체적인 REST API
 */

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자 전체 검색 API
 * 주요 기능 : 사용자 컬렉션 find 후 response
 */
router.get('/auth', async function(req, res) {
    try {
        const data = await member.find().exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사번을 통한 사용자 검색 API
 * 주요 기능 : req 사번 데이터를 통해 사용자 find 후 response
 */
router.get('/auth/:emp_no', async function(req, res) {
    try {
        const data = await member.findOne({ emp_no : req.params.emp_no }).exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자의 정보를 수정하는 API
 * 주요 기능 : req로 받은 사번, 부서, 직책, 이메일을 데이터를 사용자 컬렉션 update
 */
router.patch('/auth', async function(req, res) {
    try {
        const update = await member.update({ emp_no: req.body.emp_no },
            {
                emp_name: req.body.emp_no,
                dept:req.body.dept,
                emp_position:req.body.emp_position,
                email:req.body.email,
            });
        const data = await member.findOne({ emp_no: req.body.emp_no }).exec()
        res.status(201).json(data);
    } catch {
        res.status(400).json({ message: err.message });
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자 회원탈퇴 및 추방 API
 * 주요 기능 : req로받은 사용자 _id 로 member컬렉션 데이터 삭제 기능
 */
router.delete('/auth/:emp_id', async function(req, res) {
    try {
        const data = await member.deleteOne({ _id: req.params.emp_id}).exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

module.exports = router;