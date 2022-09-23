const express = require('express');
const router = express.Router();
const product = require('../models/product');
const category = require('../models/category');
const moment = require('moment');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품관리에서 사용될 카테고리 컬렉션의 소분류를 보내주는 API
 * 주요 기능 : req로받은 대분류데이터를 통해 소분류데이터 response
 */
router.get('/findSecondCategory/:firstCategory', async function (req, res) {
    try {
        const data = await category.find({firstCategory: req.params.firstCategory}).exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 편집 - 뮬퓸 데이터를 편집하는 함수
 * 주요 기능 : 사용자가 입력한 데이터들로 해당 물품을 편집
 */
router.patch('/', async function (req, res) {
    let newDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    const data = new product({
        product_name: req.body.product_name,
        product_category: {
            firstCategory: req.body.firstCategory
            , secondCategory: req.body.secondCategory
        },
        product_code: req.body.product_code,
        rental_availability: req.body.rental_availability,
        return_needed: req.body.return_needed,
        quantity: req.body.quantity,
        last_date: newDate
    });
    try {
        const existingProduct = await product.findOne({product_code: data.product_code}).exec();
        let leftQuantity = data.quantity - existingProduct.rentalQuantity;
        const newProduct = await product.updateOne(
            {product_code: data.product_code},
            {
                $set: {
                    product_name: data.product_name,
                    rental_availability: data.rental_availability,
                    return_needed: data.return_needed,
                    quantity: data.quantity,
                    product_category: {
                        firstCategory: data.product_category.firstCategory,
                        secondCategory: data.product_category.secondCategory
                    },
                    leftQuantity: leftQuantity,
                    last_date: data.last_date
                }
            })
        return res.status(201).json({data: newProduct, message: "물품편집이 완료되었습니다."});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대분류 조회 - 대분류 목록을 조회하는 함수
 * 주요 기능 : 카테고리 추가 모달에서 소분류 추가 선택 시 대분류 목록을 조회
 */
router.get('/findFirstCategory', async function (req, res) {
    try {
        const data = await category.find().exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대분류 등록 - 대분류를 등록하는 함수
 * 주요 기능 : 카테고리 추가 모달에서 대분류 등록 요청 시 실행되는 함수
 */
router.patch('/regFirstCategory', async function (req, res) {
    const data = new category({
        firstCategory: req.body.firstCategory,
    });
    try {
        await category.findOne({firstCategory: data.firstCategory}).exec(async (err, result) => {
            if (result) {
                return res.status(400).json({message: "이미 등록된 카테고리입니다."});
            } else {
                const newCategory = await data.save();
                console.log(data.firstCategory + "물품 편집 완료.");
                return res.status(201).json({data: newCategory, message: "물품편집이 완료되었습니다."});
            }
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 소분류 등록 - 대분류를 등록하는 함수
 * 주요 기능 : 카테고리 추가 모달에서 소분류 등록 요청 시 실행되는 함수
 */
router.post('/regCategory', function (req, res, next) {
    /** 중복 검사 */
    category.findOne({firstCategory: req.body.firstCategory}).exec(async (err, result) => {
        if (result) {
            const exist = await category.find().and([{firstCategory: req.body.firstCategory}, {secondCategory: {$all: [req.body.secondCategory]}}]).exec();

            /** 중복일 경우 */
            if (exist) {
                res.status(201).json({message: "이미 존재하는 소분류 입니다."})

            /** 중복이 아닐 경우 */
            } else {
                category.update({firstCategory: result.firstCategory}, {$push: {secondCategory: req.body.secondCategory}}).exec();
                res.status(201).json({message: "소분류 등록완료"})
            }
        } else {
            /*const data = new category({
                firstCategory: req.body.firstCategory,
                secondCategory: req.body.secondCategory
            })
            const newCategory = await data.save();*/
            return res.status(201).json({message: "잘못된 경로입니다."})
        }
    })
});
module.exports = router;