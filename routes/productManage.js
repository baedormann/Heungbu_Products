const express = require('express');
const router = express.Router();
const product = require('../models/product');
const categorys = require('../models/category');
const rental = require('../models/rental');
const editAuth = require('../middlewares/regProduct').checkToken;
const manage = require('../middlewares/manage').checkToken;
const authUtil = require('../middlewares/auth').checkToken;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품관리에 사용될 데이터와 ejs 렌더링
 * 주요 기능 : 물품과 카테고리 컬렉션 find 후 response
 */
router.get('/', authUtil, async function (req, res, next) {
    const data = await product.find().exec();
    const category = await categorys.find().exec();
    res.render('productManage', {stateUrl: 'productManage', data: data, category: category});
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 네브바 검색 또는 물품 리소스 검색에 사용될 물품검색 ejs 랜더링
 * 주요 기능 : get으로 받아온 물품이름을 통해 물품컬렉션 find 후 데이터 reponse
 */
router.get('/search/:text', authUtil, async function (req, res, next) {
    const data = await product.find({product_name: {$regex: req.params.text}}).exec();
    const category = await categorys.find().exec();
    res.render('productManage', {stateUrl: 'productManage', data: data, category: category});
});


/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품 상세화면에 필요한 데이터 API
 * 주요 기능 : req 물품 코드 데이터를 통해 물품컬렉션 find 후 response
 */
router.get('/:product_code', authUtil, async function (req, res) {
    try {
        const productDetail = await product.findOne({product_code: req.params.product_code}).exec();
        return res.status(201).json(productDetail);
    } catch (err) {
        return res.status(400).json({message: err});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품을 삭제하는 API
 * 주요 기능 : req 물품 _id데이터를 통해 물품컬렉션 데이터 삭제 기능
 */
router.delete('/:product_id', editAuth, async function(req, res) {
    try {
        const product_id = req.params.product_id;
        await product.deleteOne({_id: product_id});
        return res.status(201).end();
    } catch (err) {
        return res.status(400).json({manage: err});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품관리에서 조건에따른 검색 API
 * 주요 기능 : 물품 필터, 조건에 따른 물품 검색기능
 */
router.post('/search', authUtil, async function (req, res) {
    let condition = req.body.condition;
    let first = req.body.firstCategory;
    let second = req.body.secondCategory;
    let text = req.body.text;
    try {
        /** 물품 조건에 따른 find 기능 */
        if (condition == "product_name") {
            const products = await product.find().and([
                    {product_name: {$regex: text}},
                    first ? {"product_category.firstCategory": first} : {"product_category.firstCategory": {$exists: true}},
                    second ? {"product_category.secondCategory": second} : {"product_category.secondCategory": {$exists: true}}
                ]
            );
            return res.status(201).json({data: products});
        } else if (condition == "product_rent") {
            /** 대여자 검색 기능 */
            const products = await product.find().and([
                    first ? {"product_category.firstCategory": first} : {"product_category.firstCategory": {$exists: true}},
                    second ? {"product_category.secondCategory": second} : {"product_category.secondCategory": {$exists: true}}
                ]
            ).populate({
                path: 'rental_id',
                match: {rental_status: "대여중"},
                populate: {
                    path: 'emp_id',
                    select: 'emp_name',
                    match: {emp_name: {$regex: text}}
                }
            }).exec();
            const rentproduct = [];
            /** 대여자가 같은 물품을 대여한 물품에대하여 중복제거하여 front로 보내는 데이터 가공
             * 연관관계에의해 물품컬랙션 에서 사용자가 대여한 데이터 찾는 기능 */
            products.map((data) => {
                if (data.rental_id.length !== 0) {
                    let emp_name = '';
                    data.rental_id.map((data2) => {
                        if (data2.emp_id) {
                            if (emp_name === '') {
                                emp_name = data2.emp_id.emp_name;
                                return rentproduct.push(data);
                            }
                        }
                    })
                }
            })
            return res.status(201).json({data: rentproduct});
        }
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대여 목록을 조회하는 함수
 * 주요 기능 : 해당 물품을 대여 중인 사용자 목록을 조회
 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 편집 화면 렌더링 함수
 * 주요 기능 : 물품 편집 화면을 렌더링
 */
router.get('/edit/:product_code', editAuth, async function (req, res, next) {
    let product_code = req.params.product_code;
    const data = await product.findOne({product_code: product_code}).exec();
    const category = await categorys.find().exec();

    res.render('editProduct', {stateUrl: 'editProduct', data: data, category: category});
});


module.exports = router;
