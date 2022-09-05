// 로그아웃 요청 api
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
