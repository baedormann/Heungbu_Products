const express = require('express');
const router = express.Router();
const member = require('../models/member');

/* GET auth page. */
router.get('/', function(req, res, next) {
    res.render('auth');
});

//회원 등록
router.post('/', async function(req, res) {
    const data = new member({
        emp_no: req.body.emp_no,
        password: req.body.password,
        emp_name: req.body.emp_name,
        dept:req.body.dept,
        emp_position:req.body.emp_position,
        email:req.body.email,
        authority:req.body.authority
    });
    console.log(req.body);
    try {
        await member.findOne({ emp_no: data.emp_no }).exec(async (err, result) => {
            if(result) {
                return res.status(400).json({message: "이미 가입된 사번입니다."});
            } else {
                const newMember = await data.save();
                console.log(data.emp_no + "님이 회원가입 하셨습니다.");
                return res.status(201).json({data: newMember, message: "회원가입에 성공하셨습니다."});
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})
module.exports = router;