const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const product = require('../models/product');
const member = require('../models/member');
const rental = require('../models/rental');
const jwt = require("../config/jwt");
const {secretKey} = require("../config/secretKey");

/* GET home page. */
router.get('/', authUtil, async function (req, res, next) {
    try{
        const decode = await jwt.verify(req.cookies.token, secretKey);
        let rentals;
        let members;
        if(decode.manage||decode.open_auth){
            rentals = await rental.find({rental_status:"대여중"}).sort({rental_date: -1}).limit(5)
                .populate('product_id')
                .populate({
                    path: 'emp_id',
                    select: 'emp_name'
                });
        }
        if(decode.manage) members = await member.find().sort({emp_no: 1}).limit(5);
        const products = await product.find().sort({last_date: -1}).limit(5);
        const myInfo = await member.findOne({emp_no: decode.emp_no});
        const myRent = await rental.find({emp_id: myInfo._id, rental_status: "대여중"}).sort({rental_date: -1}).limit(5).populate('product_id');
        const myRentCount = await rental.find({emp_id: myInfo._id, rental_status: "대여중" }).count();
        const myReturnCount = await rental.find({emp_id: myInfo._id, rental_status: "반납" }).count().populate('product_id');
        const productCount = await product.find().count();
        const memberCount = await member.find().count();
        const rentalCount = await rental.find().count();
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
