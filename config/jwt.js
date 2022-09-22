const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey').secretKey;
const options = require('./secretKey').option;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
/**
 * 담당자 : 박신욱
 * 함수 설명 : jwt 토큰 발급 모듈
 * 주요 기능 : secret key를 사용한 토큰 발급 기능, 토큰 decode 사용한 검증 기능 
 */
module.exports = {
    /** 토큰 발급 기능 */
    sign: async (user) => {
        const payload = {
            emp_no: user.emp_no,
            manage: user.manage,
            edit_auth: user.edit_auth,
            rent_auth: user.rent_auth,
            open_auth: user.open_auth
        };
        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: randToken.uid(256)
        };
        return result;
    },
    /** 토큰 검증 기능 */
    verify: async (token) => {
        let decoded;
        try {
            // verify를 통해 값 decode
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}