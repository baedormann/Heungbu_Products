const express = require('express');
const router = express.Router();
const rental = require('../models/rental');
const product = require('../models/product');
const member = require('../models/member');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대여등록 API
 * 주요 기능 : req데이터를 통해 대여등록 후 물품 수량 계산 및 물품, 사용자 연관관계 주입
 * 대여 유효성 검사 기능
 */
router.post('/', async function (req, res) {
    /** req데이터로 대여모델 생성 */
    let rentalData = new rental({
        product_id: '',
        product_code: req.body.product_code,
        emp_id: '',
        rental_purpose: req.body.purpose,
        rental_date: req.body.start,
        return_deadline: req.body.end,
    })

    const productCount = await product.findOne({product_code: rentalData.product_code}).exec();
    const emp_id = await member.findOne({emp_no: req.body.emp_no}).select('_id').exec();
    rentalData.emp_id = emp_id._id;
    rentalData.product_id = productCount._id;
    try {
        /** 물품의 수량이 없을경우 메세지및 에러처리 */
        if (productCount.leftQuantity <= 0) {
            return res.status(402).send({message: '수량이 없습니다.'});
        }
        const newRental = await rentalData.save();
        const rentCount = await rental.find({
            product_code: req.body.product_code,
            rental_status: "대여중"
        }).count().exec();
        /** 남은 수량 계산 */
        let leftQuantity = productCount.quantity - rentCount;
        /** 물품수량 계산 및 대여컬렉션 연관관계주입 */
        await product.update({product_code: newRental.product_code}, {
            leftQuantity: leftQuantity,
            rentalQuantity: rentCount,
            $push: {rental_id: newRental._id}
        });
        return res.status(201).json(newRental);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

module.exports = router;
