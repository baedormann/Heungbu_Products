const express = require('express');
const router = express.Router();
const member = require('../models/member')

//회원 등록
router.post('/auth', async function(req, res) {
    const data = new member({
        emp_no: req.body.emp_no,
        password: req.body.password,
        emp_name: req.body.emp_no,
        dept:req.body.dept,
        emp_position:req.body.emp_position,
        email:req.body.email,
        authority:req.body.authority
    });
    console.log(req.body);
    try {
        const newMember = await data.save();
        console.log(data.emp_no + "님이 회원가입 하셨습니다.");
        res.status(201).json(newMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// 회원 전체 조회
router.get('/auth', async function(req, res) {
    try {
        const data = await member.find().exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// 회원 조회
router.get('/auth/:emp_no', async function(req, res) {
    try {
        const data = await member.findOne({ emp_no:req.params.emp_no }).exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// 정보 수정
router.patch('/auth', async function(req, res) {
    try {
        const update = await member.update({ emp_no: req.body.emp_no },
            {
                emp_name: req.body.emp_no,
                dept:req.body.dept,
                emp_position:req.body.emp_position,
                email:req.body.email,
                authority:req.body.authority
            });
        const data = await member.findOne({ emp_no: req.body.emp_no }).exec()
        res.status(201).json(data);
    } catch {
        res.status(400).json({ message: err.message });
    }
})

// 회원탈퇴
router.delete('/auth/:emp_no', async function(req, res) {
    try {
        const data = await member.deleteOne({ emp_no: req.params.emp_no}).exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

module.exports = router;