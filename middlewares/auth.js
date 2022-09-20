const jwt = require('../config/jwt');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

// jwt 미들웨어
const authUtil = {
    // jwt 토큰 검증
    checkToken: async (req, res, next) => {
        let token

        if (req.headers.authorization)
            token = req.headers.authorization.split(" ")[1];
        else {
            if(!req.cookies.token) {
                return res.redirect('login');
            }
            token = req.cookies.token
        }

        // 토큰 없음
        if (!token) {
            res.clearCookie('token').writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            return res.write("<script>alert('토큰이 없습니다.'); location.href = \'/login'</script>");
        }
        // decode
        const user = await jwt.verify(token);
        // 유효기간 만료
        if (user === TOKEN_EXPIRED) {
            res.clearCookie('token').writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            return res.write("<script>alert('토큰이 만료되었습니다.'); location.href = \'/login'</script>");
        }
        // 유효하지 않는 토큰
        if (user === TOKEN_INVALID) {
            res.clearCookie('token').writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            return res.write("<script>alert('토큰이 유효하지 않습니다.'); location.href = \'/login'</script>");
        }
        next();
    }
}

module.exports = authUtil;