const express = require('express');
const router = express.Router();
const product = require('../models/product');
const category = require('../models/category');
const rental = require('../models/rental');

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 등록 페이지를 렌더링하는 함수
 * 주요 기능 : 물품 컬렉션, 카테고리 컬렉션 find 후 데이터 response
 */
router.get('/', async function (req, res, next) {
    const productData = await product.find().exec();
    const categoryData = await category.find().exec();
    res.render('regProduct', {stateUrl: 'regProduct', productData: productData, categoryData: categoryData});
});

/**
 * 담당자 : 배도훈
 * 함수 설명 : 소분류 조회 - 대분류의 하위 소분류 목록을 조회하는 API
 * 주요 기능 : 대분류를 parameter로 받아서 해당 대분류의 하위 소분류 목록을 조회
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
 * 함수 설명 : 물품 등록 - 뮬퓸 데이터를 등록하는 API
 * 주요 기능 : req로 받은 데이터로 물품컬렉션에 save 하여 등록하는 기능
 */
router.post('/', async function (req, res) {
    /** request로 받은 데이터를 가공해 새로운 물품 객체 생성 */
    let data = new product({
        product_name: req.body.product_name,
        product_category: {
            firstCategory: req.body.firstCategory
            , secondCategory: req.body.secondCategory
        },
        product_code: req.body.product_code,
        rental_availability: req.body.rental_availability,
        return_needed: req.body.return_needed,
        quantity: req.body.quantity,
        leftQuantity: req.body.quantity
    });
    try {
        /** 물품 코드로 물품 중복 체크 후 물품 등록 */
        await product.findOne({product_code: data.product_code}).exec(async (err, result) => {
            if (result) {
                return res.status(401).json({message: "이미 등록된 코드입니다."});
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 엑셀 파일 데이터로 물품을 등록하는 함수
 * 주요 기능 : 사용자가 업로드한 엑셀 파일의 데이터의 유효성을 검사하고 유효하면 물품을 등록
 */
router.post('/regExcel', async function (req, res) {
    try {
        let data = [];
        /** req로 받은 데이터들을 insert할 수 있도록 데이터 가공 */
        for (let i = 0; i < req.body.length; i++) {
            data.push({
                product_code: req.body[i]['제품 코드'],
                product_name: req.body[i]['제품 이름'],
                product_category: {
                    firstCategory: req.body[i]['대분류'],
                    secondCategory: req.body[i]['소분류']
                },
                rental_availability: req.body[i]['대여 가능 여부'],
                return_needed: req.body[i]['반환 필요 여부'],
                quantity: req.body[i]['수량'],
                rentalQuantity: 0,
                leftQuantity: req.body[i]['수량'],
            });
        }

        /** 유효하지 않은 물품들의 코드를 저장할 변수 선언(유효하지 않은 코드 or 대분류 or 소분류) */
        let wrongCode = [];
        let wrongCategory1 = [];
        let wrongCategory2 = [];
        let wrongProduct = [wrongCode, wrongCategory1, wrongCategory2];

        /** 유효성 검사 */
        for (let i = 0; i < data.length; i++) {
            /** 코드 중복인 물품 */
            let codeVal = await product.findOne({product_code: data[i].product_code}).select({
                product_code: 1,
                product_name: 1
            }).exec();

            /** 없는 카테고리의 물품 */
            let firstVal = await category.findOne({firstCategory: data[i].product_category.firstCategory}).select({
                product_code: 1,
                product_name: 1
            }).exec();
            let secondVal = await category.findOne({secondCategory: data[i].product_category.secondCategory}).select({
                product_code: 1,
                product_name: 1
            }).exec();

            /** 오류 유형에 따라 데이터 삽입 */
            if (codeVal) {
                wrongCode.push({
                    product_code: data[i].product_code,
                    product_name: data[i].product_name
                });
            } else if (!firstVal) {
                wrongCategory1.push({
                    product_code: data[i].product_code,
                    product_name: data[i].product_name
                })
            } else if (!secondVal) {
                wrongCategory2.push({
                    product_code: data[i].product_code,
                    product_name: data[i].product_name
                })
            } else {
                await product.create(data[i]);
            }
        }
        /** 유효하지 않은 물품 응답 */
        return await res.status(201).json({data: wrongProduct, message: "물품등록이 완료되었습니다."});
    } catch (err) {
        res.status(400).json({message: '물품 등록 실패'})
    }
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대분류 조회 - 대분류 목록을 조회하는 API
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
 * 함수 설명 : 대분류 등록 - 대분류를 등록하는 API
 * 주요 기능 : 카테고리 추가 모달에서 대분류 등록 요청 시 실행되는 함수
 */
router.post('/regFirstCategory', async function (req, res) {
    const data = new category({
        firstCategory: req.body.firstCategory,
    });
    try {
        /** 중복된 대분류 체크 */
        await category.findOne({firstCategory: data.firstCategory}).exec(async (err, result) => {
            if (result) {
                return res.status(400).json({message: "이미 등록된 대분류입니다."});
            } else {
                const newCategory = await data.save();
                console.log(data.firstCategory + "대분류 등록 완료.");
                return res.status(201).json({data: newCategory, message: "대분류 등록이 완료되었습니다."});
            }
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 소분류 등록 - 대분류를 등록하는 API
 * 주요 기능 : 카테고리 추가 모달에서 소분류 등록 요청 시 실행되는 함수
 */
router.post('/regCategory', function (req, res, next) {
    try {
        /** 중복 검사 */
        category.findOne({firstCategory: req.body.firstCategory}).exec(async (err, result) => {
            if (result) {
                const exist = await category.findOne().and([{firstCategory: req.body.firstCategory}, {secondCategory: {$all: [req.body.secondCategory]}}]).exec();

                /** 중복일 경우 */
                if (exist) {
                    res.status(201).json({message: "이미 존재하는 소분류 입니다."})
                /** 중복이 아닐 경우 */
                } else {
                    category.update({firstCategory: result.firstCategory}, {$push: {secondCategory: req.body.secondCategory}}).exec();
                    res.status(201).json({message: "소분류 등록완료."})
                }
            } else {
                return res.status(201).json({message: "잘못된 경로입니다."})
            }
        })
    } catch (err) {
        return res.status(400).json(err)
    }
});


module.exports = router;