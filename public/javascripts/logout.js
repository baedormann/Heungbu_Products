/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그아웃 APi 요청
 * 주요 기능 : 로그아웃시 localStorage정리
 */
function logout(cookie) {
    const url = '/login/logout';
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + cookie
        }
    }).then(response => response.json()).then((data) => {
        localStorage.clear();
        location.href = '/login';
    });
}
