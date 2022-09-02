const express = require('express');
const router = express.Router();
const product = require('../models/product');

/* GET regProduct page. */
router.get('/', function(req, res, next) {
    res.render('regProduct', {stateUrl: 'regProduct'});
});

//물품 등록
router.post('/', async function(req, res) {
    console.log(req.body);
    const data = new product({
        product_name : req.body.product_name,
        product_category : {firstCategory : req.body.product_category.firstCategory
                            , secondCategory: req.body.product_category.secondCategory},
        product_code : req.body.product_code,
        rental_availability : req.body.rental_availability,
        return_needed : req.body.return_needed,
        quantity : req.body.quantity
    });
    console.log("data : " + data);
    try {
        await product.findOne({ product_code: data.product_code }).exec(async (err, result) => {
            if(result) {
                return res.status(400).json({message: "이미 등록된 코드입니다."});
            } else {
                const newProduct = await data.save();
                console.log(data.product_code + "물품 등록 완료.");
                return res.status(201).json({data: newProduct, message: "물품등록이 완료되었습니다."});
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})
module.exports = router;