// jwt 미들웨어
const noLogin = {
    // jwt 토큰 검증
    checkToken: async (req, res, next) => {
        let token
        if (req.cookies.token) {
            return res.redirect('/');
        }
        next();
    }
}

module.exports = noLogin;