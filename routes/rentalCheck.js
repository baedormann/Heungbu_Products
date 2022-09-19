const express = require('express');
const router = express.Router();
const rental = require('../models/rental');
/* GET rentalCheck page. */
router.get('/', async function(req, res, next) {
    const rentalList = await rental.find()
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).
        sort({rental_date:-1}).exec();
    const rentRentalList = await rental.find({ rental_status:"대여중"})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).
        sort({rental_date:-1}).exec();
    const returnRentalList = await rental.find({ rental_status:"반납"})
        .populate('product_id')
        .populate({
            path: 'emp_id',
            select: 'emp_name'
        }).
        sort({rental_date:-1}).exec();

    res.render('rentalCheck', { stateUrl: 'rentStatus', full: rentalList, rent:rentRentalList, returns:returnRentalList  });
});

module.exports = router;
