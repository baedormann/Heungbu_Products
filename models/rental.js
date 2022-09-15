const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 대여 스키마
const rentalSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    product_code: {
        type: String,
        required: true
    },
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