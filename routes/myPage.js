const express = require('express');
const rental = require("../models/rental");
const jwt = require('../config/jwt');
const secretKey = require('../config/secretKey').secretKey;
const router = express.Router();
const member = require('../models/member');
const moment = require('moment');
const product = require("../models/product");

/* GET myPage page. */
router.get('/', async function (req, res, next) {
    const decode = await jwt.verify(req.cookies.token, secretKey);
    const users = await member.findOne({emp_no: decode.emp_no});
    const fullRentalList = await rental.find({emp_id: users._id})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).
        sort({rental_date:-1}).exec();
    const rentRentalList = await rental.find({emp_id: users._id, rental_status:"대여중"})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).
        sort({rental_date:-1}).exec();
    const returnRentalList = await rental.find({emp_id: users._id, rental_status:"반납"})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).
        sort({rental_date:-1}).exec();
    res.render('myPage', {stateUrl: 'myPage', full: fullRentalList, rent:rentRentalList, returns:returnRentalList, user: users});
});

router.patch('/return', async function (req, res) {
    console.log("실행");
    const rentalId = req.body._id;
    let newDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    try {
        const returnRent = await rental.findOneAndUpdate({_id: rentalId},
            {
                $set:{
                    rental_status: "반납",
                    return_date: newDate
                }
            }).exec()
        const rentCount = await rental.find({
            product_code: returnRent.product_code,
            rental_status: "대여중"
        }).count().exec();

        const productCount = await product.findOne({product_code: returnRent.product_code}).exec();
        let leftQuantity = productCount.quantity - rentCount;
        await product.update({product_code: returnRent.product_code}, {
            leftQuantity: leftQuantity,
            rentalQuantity: rentCount,
        });
        res.status(201).json(returnRent);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = router;
