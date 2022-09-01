const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 물품 스키마
const categorySchema = new Schema({
    category:
        {
            name:{
                type:String,
                unique:true,
            },
            secondCategory:{
                type: [String],
                required: true,
            }
        }
}, {versionKey : false})

module.exports = mongoose.model('category', categorySchema);