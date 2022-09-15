const express = require('express');
const router = express.Router();
const category = require('../models/category');

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
