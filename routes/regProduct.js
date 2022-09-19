const express = require('express');
const router = express.Router();
const product = require('../models/product');
const category = require('../models/category');
const rental = require('../models/rental');

/* GET regProduct page. */
router.get('/', async function (req, res, next) {
    const productData = await product.find().exec();
    const categoryData = await category.find().exec();
    res.render('regProduct', {stateUrl: 'regProduct', productData: productData, categoryData: categoryData});
});

//대분류 선택 시
router.get('/findSecondCategory/:firstCategory', async function (req, res) {
    try {
        const data = await category.find({firstCategory: req.params.firstCategory}).exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//물품 등록
router.post('/', async function (req, res) {
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

//Excel로 물품 등록
router.post('/regExcel', async function (req, res) {
    try {
        let data = [];
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

        let wrongCode = [];
        let wrongCategory1 = [];
        let wrongCategory2 = [];
        let wrongProduct = [wrongCode, wrongCategory1, wrongCategory2];

        for (let i = 0; i < data.length; i++) {
            let codeVal = await product.findOne({product_code: data[i].product_code}).select({
                product_code: 1,
                product_name: 1
            }).exec();
            let firstVal = await category.findOne({firstCategory: data[i].product_category.firstCategory}).select({
                product_code: 1,
                product_name: 1
            }).exec();
            let secondVal = await category.findOne({secondCategory: data[i].product_category.secondCategory}).select({
                product_code: 1,
                product_name: 1
            }).exec();
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

        return await res.status(201).json({data: wrongProduct, message: "물품등록이 완료되었습니다."});
    } catch (err) {
        res.status(400).json({message: '물품 등록 실패'})
    }
})

//카테고리 추가 모달에서 소분류 추가 선택 시
router.get('/findFirstCategory', async function (req, res) {
    try {
        const data = await category.find().exec();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//대분류 카테고리 등록
router.post('/regFirstCategory', async function (req, res) {
    const data = new category({
        firstCategory: req.body.firstCategory,
    });
    try {
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

//소분류 카테고리 등록
router.post('/regCategory', function (req, res, next) {
    try {
        //소분류 없을 때
        /*if(!req.body.secondCategory){
            return res.status(401).send({message: "소분류명을 입력해주세요."});
        }*/
        category.findOne({firstCategory: req.body.firstCategory}).exec(async (err, result) => {
            if (result) {
                const exist = await category.findOne().and([{firstCategory: req.body.firstCategory}, {secondCategory: {$all: [req.body.secondCategory]}}]).exec();
                if (exist) {
                    res.status(201).json({message: "이미 존재하는 소분류 입니다."})
                } else {
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
    } catch (err) {
        return res.status(400).json(err)
    }

});


module.exports = router;