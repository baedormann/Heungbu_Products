const express = require('express');
const router = express.Router();
const category = require('../models/category');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품관리에서 사용될 카테고리 컬렉션의 소분류를 보내주는 API
 * 주요 기능 : req로받은 대분류데이터를 통해 소분류데이터 response
 */
router.get('/:firstCategory', async function (req, res) {
    try{
        const data = await category.find({ firstCategory: req.params.firstCategory }).exec();
        res.status(201).json(data);
    }catch (err){
        res.status(400).json({message: err.message});
    }
})

module.exports = router;
