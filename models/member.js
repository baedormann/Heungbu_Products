const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const rental = require("./rental");
const saltRounds = 10;

// 유저 스키마
const memberSchema = new Schema({
    emp_no:
        {
            type: String,
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
    manage:
        {
            type: Boolean,
            default: false
        },
    edit_auth:
        {
            type: Boolean,
            default: false
        },
    rent_auth:
        {
            type: Boolean,
            default: false
        },
    open_auth:
        {
            type: Boolean,
            default: false
        },
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

memberSchema.pre('findOneAndUpdate', function(next) {
    const user = this;
    if (user.getUpdate().password) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.getUpdate().password, salt, function (err, hash) {
                if (err) return next(err)
                user.getUpdate().password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

memberSchema.pre("deleteOne", async function (next) {
        const { _id } = this.getFilter();
        await rental.deleteMany({ emp_id: _id });
        next();
    }
)


module.exports = mongoose.model('member', memberSchema);