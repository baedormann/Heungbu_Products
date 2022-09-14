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
        })
        .exec();
    console.log(rentalList)
    res.render('rentalCheck', { stateUrl: 'rentStatus', data: rentalList });
});

module.exports = router;
