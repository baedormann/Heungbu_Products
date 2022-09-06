const express = require('express');
const router = express.Router();
const product = require('../models/product');
const categorys = require('../models/category');

/* GET productManage page. */
router.get('/', async function (req, res, next) {
    const data = await product.find().exec();
    const category = await categorys.find().exec();
    res.render('productManage', {stateUrl: 'productManage', data: data, category: category});
});

// 물품 검색
router.post('/search', async function (req, res) {
    let condition = req.body.condition;
    let first = req.body.firstCategory;
    let second = req.body.secondCategory;
    let text = req.body.text;
    try {
        if (condition == "product_name") {
            const products = await product.find().and([
                {product_name: {$regex: text}},
                first ? {"product_category.firstCategory": first} : {"product_category.firstCategory": {$exists:true}},
                second ? {"product_category.secondCategory": second} : {"product_category.secondCategory": {$exists:true}}
                ]
            );
            return res.status(201).json({data: products})
        }
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = router;
