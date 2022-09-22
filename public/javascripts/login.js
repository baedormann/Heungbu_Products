/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그인 API를 요청하는 함수
 * 주요 기능 : 로그인 데이터가공, 아이디기억기능 > 사번쿠키 저장, 로그인 API요청
 */
function login() {
    const user = {
        emp_no: document.getElementById("emp_no").value,
        password: document.getElementById("password").value
    };

    if(document.getElementById("checkId").checked)
        setCookie("id", user.emp_no, 7)
    else
        deleteCookie("id");

    /** 로그인 API 요청 후 localStorage에 필요한 데이터 저장(사용자 정보, 권한) */
    const url = "/login"
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    }).then(response => response.json()).then((data) => {
        alert(data.message);
        localStorage.setItem('emp_no', data.data.emp_no);
        localStorage.setItem('emp_name', data.data.emp_name);
        localStorage.setItem('manage', data.data.manage);
        localStorage.setItem('edit_auth', data.data.edit_auth);
        localStorage.setItem('rent_auth', data.data.rent_auth);
        localStorage.setItem('open_auth', data.data.open_auth);
        location.href = '/';
    }).catch(err => console.log(err));
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그인 시 엔터 처리
 * 주요 기능 : 엔터 키 입력시 로그인 함수 요청
 */
function enter() {
    if (window.event.keyCode == 13) {
        login();
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 아이디 기억 기능
 * 주요 기능 : 사번쿠키값을 가져와 아이디값지정
 */
window.onload = function() {
    if(getCookie("id")){
        document.getElementById("emp_no").value = getCookie("id");
        document.getElementById("checkId").checked = true;
    }
}

