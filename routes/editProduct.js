const express = require('express');
const router = express.Router();
const product = require('../models/product');
const category = require('../models/category');

/* GET editProduct page. */
router.post('/', async function (req, res, next) {
    const productData = await product.find().exec();
    const categoryData = await category.find().exec();
    res.render('editProduct', {stateUrl: 'editProduct', productData: productData, categoryData: categoryData});
});

//대분류 선택 시
router.get('/findSecondCategory/:firstCategory', async function(req, res) {
    try {
        const data = await category.find({ firstCategory : req.params.firstCategory }).exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//물품 등록
router.post('/', async function (req, res) {
    console.log(req.body);
    const data = new product({
        product_name: req.body.product_name,
        product_category: {
            firstCategory: req.body.firstCategory
            , secondCategory: req.body.secondCategory
        },
        product_code: req.body.product_code,
        rental_availability: req.body.rental_availability,
        return_needed: req.body.return_needed,
        quantity: req.body.quantity
    });
    console.log("data : " + data);
    try {
        await product.findOne({product_code: data.product_code}).exec(async (err, result) => {
            if (result) {
                return res.status(400).json({message: "이미 등록된 코드입니다."});
            } else {
                const newProduct = await data.save();
                console.log(data.product_code + "물품 등록 완료.");
                return res.status(201).json({data: newProduct, message: "물품등록이 완료되었습니다."});
            }
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//카테고리 추가 모달에서 소분류 추가 선택 시
router.get('/findFirstCategory', async function(req, res) {
    try {
        const data = await category.find().exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//대분류 카테고리 등록
router.post('/regFirstCategory', async function (req, res) {
    console.log(req.body);
    const data = new category({
        firstCategory: req.body.firstCategory,
    });
    console.log("data : " + data);
    try {
        await category.findOne({firstCategory: data.firstCategory}).exec(async (err, result) => {
            if (result) {
                return res.status(400).json({message: "이미 등록된 카테고리입니다."});
            } else {
                const newCategory = await data.save();
                console.log(data.firstCategory + "물품 등록 완료.");
                return res.status(201).json({data: newCategory, message: "물품등록이 완료되었습니다."});
            }
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//전체 카테고리 등록
router.post('/regCategory', function (req, res, next) {
    category.findOne({firstCategory: req.body.firstCategory}).exec(async (err, result) => {
        if (result) {
            const exist = await category.find().and([{firstCategory: req.body.firstCategory},{secondCategory: {$all: [req.body.secondCategory]}}]).exec();
            if(exist){
                res.status(201).json({message: "이미 존재하는 소분류 입니다."})
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
module.exports = router;