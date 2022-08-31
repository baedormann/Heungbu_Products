const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 유저 스키마
const memberSchema = new Schema({
    emp_no:
        {
            type: Number,
            unique: true,
            required: true,
        },
    password:
        {
            type: String,
            required: true,
        },
    emp_name:
        {
            type: String,
            required: true,
            default: " ",
        },
    dept:
        {
            type: String,
        },
    emp_position:
        {
            type: String,
        },
    email:
        {
            type: String,
            required: true,
        },
    authority:
        {
            type: [String]
        }
}, {versionKey : false})

memberSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

module.exports = mongoose.model('member', memberSchema);