const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 분류 스키마
const productSchema = new Schema({
    product_name:
        {
            type: String,
            unique: true,
            required: true,
        },
    product_category:
        {
            firstCategory: {
                type: String,
                required: true,
            },
            secondCategory: {
                type: String,
                required: true,
            }
        },
    product_code:
        {
            type: String,
            unique: true,
            required: true,
            tags:{type:[String], index: true}
        },
    rental_availability:
        {
            type: Boolean,
            default: false,
        },
    return_needed:
        {
            type: Boolean,
            default: false,
        },
    quantity:
        {
            type: Number,
            required: true,
        },
    rentalQuantity: {
        type: Number,
        default: 0,
        required: true
    },
    leftQuantity: {
        type: Number,
        required: true,
    },
    last_date:
        {
            type: Date,
            default: new Date().toISOString()
        },
    rental_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "rental"
    }]
}, {versionKey: false})

module.exports = mongoose.model('product', productSchema);