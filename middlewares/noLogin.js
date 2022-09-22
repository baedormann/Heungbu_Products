/**
 * 담당자 : 박신욱
 * 함수 설명 : jwt 회원 인증 미들웨어
 * 주요 기능 : 로그인이 되어 있을 때 /login 으로 접속하는 경우
 */
const noLogin = {
    /** 쿠키를 통한 토큰 검증 */
    checkToken: async (req, res, next) => {
        if (req.cookies.token) {
            return res.redirect('/');
        }
        next();
    }
}

module.exports = noLogin;