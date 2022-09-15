const express = require('express');
const router = express.Router();
const product = require('../models/product');
const categorys = require('../models/category');
const rental = require('../models/rental');
const editAuth = require('../middlewares/regProduct').checkToken;
const manage = require('../middlewares/manage').checkToken;
const authUtil = require('../middlewares/auth').checkToken;

/* GET productManage page. */
router.get('/', authUtil, async function (req, res, next) {
    const data = await product.find().exec();
    const category = await categorys.find().exec();
    res.render('productManage', {stateUrl: 'productManage', data: data, category: category});
});

// 물품 상세 화면
router.get('/:product_code', authUtil, async function (req, res) {
    try {
        const productDetail = await product.findOne({product_code: req.params.product_code}).exec();
        return res.status(201).json(productDetail);
    } catch (err) {
        return res.status(400).json({message: err});
    }
})

// 물품 검색
router.post('/search', authUtil, async function (req, res) {
    let condition = req.body.condition;
    let first = req.body.firstCategory;
    let second = req.body.secondCategory;
    let text = req.body.text;
    try {
        if (condition == "product_name") {
            const products = await product.find().and([
                    {product_name: {$regex: text}},
                    first ? {"product_category.firstCategory": first} : {"product_category.firstCategory": {$exists: true}},
                    second ? {"product_category.secondCategory": second} : {"product_category.secondCategory": {$exists: true}}
                ]
            );
            return res.status(201).json({data: products});
        } else if (condition == "product_rent") {
            const products = await product.find().and([
                    first ? {"product_category.firstCategory": first} : {"product_category.firstCategory": {$exists: true}},
                    second ? {"product_category.secondCategory": second} : {"product_category.secondCategory": {$exists: true}}
                ]
            ).populate({
                path: 'rental_id',
                match:{rental_status: "대여중"},
                populate: {
                    path: 'emp_id',
                    select: 'emp_name',
                    match:{emp_name:{$regex:text}}
                }
            }).exec();
            const rentproduct = [];
            products.map((data)=>{
                if(data.rental_id.length !== 0){
                    let emp_name = '';
                    data.rental_id.map((data2)=>{
                        if(data2.emp_id){
                            if(emp_name === ''){
                                emp_name = data2.emp_id.emp_name;
                                return rentproduct.push(data);
                            }
                        }
                    })
                }
            })
            console.log(rentproduct);
            return res.status(201).json({data: rentproduct});
        }
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
})

// 물품 대여 명단
router.post('/rentalList', manage, async function (req, res) {
    try {
        const rentalList = await rental.find({product_code: req.body.product_code, rental_status: '대여중'})
            .populate('product_id')
            .populate({
                path: 'emp_id',
                select: 'emp_name'
            })
            .exec();
        return res.status(201).json(rentalList);
    } catch (err) {
        return res.status(400).json({message: err});
    }
})

//물품 편집 화면으로 이동
router.get('/edit/:product_code', editAuth, async function (req, res, next) {
    let product_code = req.params.product_code;
    const data = await product.findOne({product_code: product_code}).exec();
    const category = await categorys.find().exec();

    res.render('editProduct', {stateUrl: 'editProduct', data: data, category: category});
});

module.exports = router;
