const express = require('express');
const router = express.Router();
const category = require('../models/category');

// 카테고리 등록
router.post('/', function (req, res, next) {
    category.findOne({firstCategory: req.body.firstCategory}).exec(async (err, result) => {
        if (result) {
            const exist = await category.findOne({secondCategory: {$all: [req.body.secondCategory]}}).exec();
            if(exist){
                res.status(400).json({message: "이미 존재하는 소분류 입니다."})
            }else{
                category.update({firstCategory: result.firstCategory}, {$push: {secondCategory: req.body.secondCategory}}).exec();
                res.status(201).json({message: "소분류 등록완료."})
            }
        } else {
            const data = new category({
                firstCategory: req.body.firstCategory,
                secondCategory: req.body.secondCategory
            })
            const newCategory = await data.save();
            return res.status(201).json({message: "새 대분류 및 소분류 등록"})
        }
    })
});

// 분류 검색
router.get('/:firstCategory', async function (req, res) {
    try{
        const data = await category.find({ firstCategory: req.params.firstCategory }).exec();
        res.status(201).json(data);
    }catch (err){
        res.status(400).json({message: err.message});
    }
})

module.exports = router;
