const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const product = require('../models/product');
const member = require('../models/member');
const rental = require('../models/rental');
const jwt = require("../config/jwt");
const {secretKey} = require("../config/secretKey");

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메인페이지에 사용될 데이터와 메인페이지 ejs 렌더링
 * 주요 기능 : 권한에 따라 메인페이지에서 사용될 물품, 대여, 사용자 데이터들을 response
 */
router.get('/', authUtil, async function (req, res, next) {
    try{
        /** jwt토큰을 decode하여 권한 정보, 현재 사용자 정보 */
        const decode = await jwt.verify(req.cookies.token, secretKey);
        let rentals;
        let members;

        /** decode 한 데이터를 통해 관리자 또는 열람 권한 검증 대여현황 데이터 */
        if(decode.manage||decode.open_auth){
            rentals = await rental.find({rental_status:"대여중"}).sort({rental_date: -1}).limit(5)
                .populate('product_id')
                .populate({
                    path: 'emp_id',
                    select: 'emp_name'
                });
        }
        /** decode 한 데이터를 통해 관리자 이용자관리 데이터 */
        if(decode.manage) members = await member.find().sort({emp_no: 1}).limit(5);

        const products = await product.find().sort({last_date: -1}).limit(5);
        const myInfo = await member.findOne({emp_no: decode.emp_no});
        const myRent = await rental.find({emp_id: myInfo._id, rental_status: "대여중"}).sort({rental_date: -1}).limit(5).populate('product_id');
        const myRentCount = await rental.find({emp_id: myInfo._id, rental_status: "대여중" }).count();
        const myReturnCount = await rental.find({emp_id: myInfo._id, rental_status: "반납" }).count().populate('product_id');
        const productCount = await product.find().count();
        const memberCount = await member.find().count();
        const rentalCount = await rental.find({rental_status: "대여중"}).count();
        res.render('index', {
            stateUrl: 'home',
            products: products,
            productCount: productCount,
            members: members,
            memberCount: memberCount,
            myInfo: myInfo,
            myRent: myRent,
            myRentCount: myRentCount,
            myReturnCount: myReturnCount,
            rentals: rentals,
            rentalCount: rentalCount
        });
    }catch(e){
        res.clearCookie('token').redirect('/login');
    }
});

module.exports = router;
