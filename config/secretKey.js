/**
 * 담당자 : 박신욱
 * 함수 설명 : secret key 설정
 * 주요 기능 : 토큰 발급 시 사용될 secret key를 설정하는 모듈
 */
module.exports = {
    secretKey : 'HeUnGbuCrEtKeY', // 원하는 시크릿 키
    option : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "1h",  // 토큰 유효 기간
        issuer : "hengBu" // 발행자
    }
}