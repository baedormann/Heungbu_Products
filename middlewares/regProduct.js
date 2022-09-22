const jwt = require('../config/jwt');
const secretKey = require('../config/secretKey').secretKey;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

/**
 * 담당자 : 박신욱
 * 함수 설명 : jwt 회원 인증 미들웨어
 * 주요 기능 : response header 토큰 값 또는 쿠키 토큰 값을 통한 권한 처리
 */
const regUtil = {
    /** jwt 토큰 검증 */
    checkToken: async (req, res, next) => {
        let token
        /** response header 토큰 검증 */
        if (req.headers.authorization)
            token = req.headers.authorization.split(" ")[1];
        else {
            /** 쿠키 토큰 검증 */
            if(!req.cookies.token) {
                return res.redirect('login');
            }
            token = req.cookies.token
        }

        /** 등록 권한 검증 */
        const decode = await jwt.verify(token, secretKey);
        /** 관리자가 아니거나 등록 권한이 없는 경우 */
        if(!(decode.manage||decode.edit_auth)){
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            return res.write("<script>alert('등록권한이 없습니다.'); window.history.back();'/'</script>");
        }

        /** 토큰이 없는 경우 */
        if (!token) {
            res.clearCookie('token').writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            return res.write("<script>alert('토큰이 없습니다.'); location.href = \'/login'</script>");
        }
        const user = await jwt.verify(token);
        /** 유효기간 만료됐을 경우 */
        if (user === TOKEN_EXPIRED) {
            res.clearCookie('token').writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            return res.write("<script>alert('토큰이 만료되었습니다.'); location.href = \'/login'</script>");
        }
        /** 유효하지 않은 토큰일 경우 */
        if (user === TOKEN_INVALID) {
            res.clearCookie('token').writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            return res.write("<script>alert('토큰이 유효하지 않습니다.'); location.href = \'/login'</script>");
        }
        next();
    }
}

module.exports = regUtil;