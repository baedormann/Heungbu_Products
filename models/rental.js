const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 대여 스키마
const rentalSchema = new Schema({
            product_code:{
                type: String,
                required: true
            },
            emp_no:{
                type: String,
                required: true
            },
            rental_purpose:{
                type: String,
                required: true
            },
            rental_date:{
                type: Date,
                required: true,
                default: new Date().toISOString()
            },
            return_deadline:{
                type: Date,
                required: true
            }

}, {versionKey : false})

module.exports = mongoose.model('rental', rentalSchema);