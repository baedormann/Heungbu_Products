const express = require('express');
const router = express.Router();
const rental = require('../models/rental');
const product = require('../models/product');

// 대여추가
router.post('/', async function (req, res) {
    let rentalData = new rental({
        product_id : '',
        product_code: req.body.product_code,
        emp_no: req.body.emp_no,
        rental_purpose: req.body.purpose,
        rental_date: req.body.start,
        return_deadline: req.body.end,
    })
    const productCount = await product.findOne({product_code: rentalData.product_code}).exec();
    rentalData.product_id = productCount._id;
    try {
        const newRental = await rentalData.save();
        const rentCount = await rental.find({
            product_code: newRental.product_code,
            rental_status: "대여중"
        }).count().exec();
        let leftQuantity = productCount.quantity - rentCount;
        if(leftQuantity<0){
            return res.status(402).send({message : '수량이 없습니다.'});
        }
        await product.update({product_code: newRental.product_code}, {
            leftQuantity: leftQuantity,
            rentalQuantity: rentCount
        });

        return res.status(201).json(newRental);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

module.exports = router;
