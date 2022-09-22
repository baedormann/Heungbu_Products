const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 담당자 : 공통
 * 함수 설명 : 카테고리 모델
 * 주요 기능 : 카테고리 스키마 설계
 */
const categorySchema = new Schema({
            firstCategory:{
                type:String,
                unique:true,
            },
            secondCategory:{
                type: Array,
            }
}, {versionKey : false})

module.exports = mongoose.model('category', categorySchema);