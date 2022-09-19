const express = require('express');
const router = express.Router();
const member = require('../models/member')

/* GET manageUser page. */
router.get('/', async function (req, res, next) {
    const data = await member.find().exec();
    res.render('manageUser', {stateUrl: 'manageUser', data: data});
});

// 권한 회수 및 부여
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

// 비밀번호 초기화
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


// 물품 검색
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
