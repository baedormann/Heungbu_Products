const express = require('express');
const router = express.Router();
const member = require('../models/member')

router.post('/auth', async function(req, res) {
    const data = new member({
        emp_no: req.body.emp_no,
        password: req.body.password
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

module.exports = router;
