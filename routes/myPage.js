const express = require('express');
const rental = require("../models/rental");
const jwt = require('../config/jwt');
const secretKey = require('../config/secretKey').secretKey;
const router = express.Router();
const member = require('../models/member');
const moment = require('moment');
const product = require("../models/product");
const bcrypt = require("bcrypt");

/**
 * 담당자 : 박신욱
 * 함수 설명 : 마이페이지에 사용될 데이터와 ejs 렌더링
 * 주요 기능 : 나의 대여현황들과 나의 정보 들의 데이터 가공 후 response
 */
router.get('/', async function (req, res, next) {
    const decode = await jwt.verify(req.cookies.token, secretKey);
    const users = await member.findOne({emp_no: decode.emp_no});
    const fullRentalList = await rental.find({emp_id: users._id})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).sort({rental_date: -1}).exec();
    const rentRentalList = await rental.find({emp_id: users._id, rental_status: "대여중"})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).sort({rental_date: -1}).exec();
    const returnRentalList = await rental.find({emp_id: users._id, rental_status: "반납"})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).sort({rental_date: -1}).exec();
    res.render('myPage', {
        stateUrl: 'myPage',
        full: fullRentalList,
        rent: rentRentalList,
        returns: returnRentalList,
        user: users
    });
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 마이페이지에서의 반납 API
 * 주요 기능 : 반납일자와 반납후 물품 수량 계산기능
 */
router.patch('/return', async function (req, res) {
    console.log("실행");
    const rentalId = req.body._id;
    let newDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    try {
        /** 대여중인 대여컬렉션을 반납으로 update */
        const returnRent = await rental.findOneAndUpdate({_id: rentalId},
            {
                $set: {
                    rental_status: "반납",
                    return_date: newDate
                }
            }).exec()

        /** 물품 남은수량, 대여중 수량 계산 */
        const rentCount = await rental.find({
            product_code: returnRent.product_code,
            rental_status: "대여중"
        }).count().exec();

        const productCount = await product.findOne({product_code: returnRent.product_code}).exec();
        let leftQuantity = productCount.quantity - rentCount;

        /** 계산된 수량을 물품컬렉션에 update 기능 */
        await product.update({product_code: returnRent.product_code}, {
            leftQuantity: leftQuantity,
            rentalQuantity: rentCount,
        });

        res.status(201).json(returnRent);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 마이페이지에서 내정보수정 화면 호출 API
 * 주요 기능 : 토큰으로 decode된 데이터로 사용자정보 추출후 response
 */
router.get('/modify', async function (req, res, next) {
    const decode = await jwt.verify(req.cookies.token, secretKey);
    const users = await member.findOne({emp_no: decode.emp_no});
    res.render('myInfoModify', {stateUrl: 'myPage', users: users});
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 내정보 수정 API
 * 주요 기능 : req로 이름, 부서, 직책데이터를 통해 사용자컬렉션 update기능
 */
router.patch('/modify', async function (req, res) {
    try {
        await member.updateOne({emp_no: req.body.emp_no}, {
            $set: {
                emp_name: req.body.emp_name,
                dept: req.body.dept,
                emp_position: req.body.emp_position
            }
        })
        res.status(200).end();
    } catch (e) {
        res.status(400).json({message: e});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 내정보 비밀번호 수정 API
 * 주요 기능 : 현재비밀번호의 유효성검사후 비밀번호 변경 기능
 */
router.patch('/modify/password', async function (req, res) {
    try {
        /** 사번을통해 사용자데이터 find 후 비밀번호 유효성검사 후 비밀번호 update */
        await member.findOne({emp_no: req.body.emp_no}).exec(async (err, result) => {
            if (result) {
                if (bcrypt.compareSync(req.body.password, result.password)) {
                    await member.findOneAndUpdate({emp_no: result.emp_no}, {password: req.body.newPassword})
                        .exec(async (err, result)=>{
                            await res.status(200).send({message:"비밀번호를 변경하였습니다."});
                        });
                }else{
                    await res.status(201).json({message:"현재 비밀번호를 정확히 입력해주세요."});
                }
            }
        })
    } catch (e) {
        res.status(400).json({message: e});
    }
})

module.exports = router;
