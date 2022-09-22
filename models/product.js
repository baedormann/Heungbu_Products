const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rental = require('./rental');

/**
 * 담당자 : 공통
 * 함수 설명 : 물품 모델
 * 주요 기능 : 물품 스키마 설계
 */
const productSchema = new Schema({
    product_name:
        {
            type: String,
            required: true
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
            tags: {type: [String], index: true}
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
    /** 렌트 컬렉션 다대일 연관관계 양방향 매핑 */
    rental_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "rental"
    }]
}, {versionKey: false})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품 삭제시 대여 스키마와의 연관관계 해지
 * 주요 기능 : 사용된 물품 _id 필터를 가져와 삭제되는 물품과 연관된 대여 컬렉션 데이터 삭제
 */
productSchema.pre("deleteOne",  { document: true, query: true },async function (next) {
        const {_id} = this.getFilter();
        await rental.deleteMany({product_id: _id});
        next();
    }
)


module.exports = mongoose.model('product', productSchema);