const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 카테고리 스키마
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