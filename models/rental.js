const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 담당자 : 공통
 * 함수 설명 : 대여 모델
 * 주요 기능 : 대여 스키마 설계
 */
const rentalSchema = new Schema({
    /** 물품 컬렉션 다대일 연관관계 양방향 매핑 */
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    product_code: {
        type: String,
        required: true
    },
    /** 사용자 컬렉션 다대일 연관관계 단방향 매핑 */
    emp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "member"
    },
    rental_purpose: {
        type: String,
    },
    rental_date: {
        type: Date,
        required: true
    },
    return_date: {
        type: Date,
        default: null
    },
    return_deadline: {
        type: Date,
        required: true
    },
    rental_status: {
        type: String,
        required: true,
        default: "대여중"
    }
}, {versionKey: false})


module.exports = mongoose.model('rental', rentalSchema);