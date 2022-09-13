const express = require('express');
const router = express.Router();
const rental = require('../models/rental');

// 대여추가
router.post('/' ,async function(req, res) {
    const rentalData = new rental({
        product_code : req.body.product_code,
        emp_no : req.body.emp_no,
        rental_purpose: req.body.purpose,
        rental_date : req.body.start,
        return_deadline : req.body.end,
    })
    console.log(rentalData);
    try {
        const newRental = await rentalData.save();
        return res.status(201).json(newRental);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
