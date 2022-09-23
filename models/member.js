const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const rental = require("./rental");
const product = require("./product");
const saltRounds = 10;

/**
 * 담당자 : 공통
 * 함수 설명 : 사용자 모델
 * 주요 기능 : 사용자 스키마 설계
 */
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
}, {versionKey: false})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입시 비밀번호 암호화 DB미들웨어
 * 주요 기능 : 사용자 컬렉션의 save메서드 실행시
 * 비밀번호 부분을 bcrypt 모듈을 활용한 비밀번호 암호화먼저 실행 후 원래 함수 실행
 */
memberSchema.pre('save', function (next) {
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 비밀번호 변경시 비밀번호 암호화 DB미들웨어
 * 주요 기능 : 사용자 컬렉션의 findOneAndUpdate 메서드 실행시
 * bcrypt 모듈을 활용한 비밀번호 암호화먼저 실행 후 원래 함수 실행
 */
memberSchema.pre('findOneAndUpdate', function (next) {
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자 추방시 대여 스키마와의 연관관계 해지, 대여한 물품의 수량 업데이트 DB미들웨어
 * 주요 기능 : 사용자 컬렉션의 deleteOne 메서드 실행시
 * 사용된 사용자 _id 필터를 가져와 삭제되는 사용자와 연관된 대여 컬렉션 데이터 삭제 및
 * 관련된 물품 수량 업데이트 후 원래 함수 실행
 */
memberSchema.pre("deleteOne", async function (next) {
        const {_id} = this.getFilter();
        await rental.find({emp_id: _id}).exec(async (err, result) => {
            result.map(async (data) => {
                console.log(data);
                await product.updateOne({_id: data.product_id}, {
                        $inc: {
                            leftQuantity: +1,
                            rentalQuantity: -1
                        },
                        $pullAll: {
                            rental_id: [data._id]
                        }
                    }
                );
                console.log("실행");
            })
            await rental.deleteMany({emp_id: _id});
        })
        next();
    }
)


module.exports = mongoose.model('member', memberSchema);