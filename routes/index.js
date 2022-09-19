const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const product = require('../models/product');
const member = require('../models/member');
const rental = require('../models/rental');
const jwt = require("../config/jwt");
const {secretKey} = require("../config/secretkey");

/* GET home page. */
router.get('/', authUtil, async function (req, res, next) {
    const decode = await jwt.verify(req.cookies.token, secretKey);
    let rentals;
    let members;
    if(decode.manage||decode.open_auth){
        rentals = await rental.find().sort({rental_date: -1}).limit(5);
    }
    if(decode.manage) members = await member.find().sort({emp_no: 1}).limit(5);
    const products = await product.find().sort({last_date: -1}).limit(5);
    const myInfo = await member.findOne({emp_no: decode.emp_no});
    const myRent = await rental.find({emp_id: myInfo._id}).sort({rental_date: -1}).limit(5);

    res.render('index', {
        stateUrl: 'home',
        products: products,
        members: members,
        myInfo: myInfo,
        myRent: myRent,
        rentals: rentals
    });
});

module.exports = router;
