let time = 0;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 토큰 만료시간을 요청 후 만료시간 대입 및 네브바의 권한에 따른 매뉴 숨김
 * 주요 기능 : localStorage에 저장된 권한에 따라 아이콘 UI 표시, 토큰의 만료시간 API 요청(토큰 헤더에 함께 요청)
 */
window.onload=function(){
    if(!JSON.parse(localStorage.getItem('manage')))
        document.querySelector(".manageTap").remove();
    if(!(JSON.parse(localStorage.getItem('open_auth')) || JSON.parse(localStorage.getItem('manage'))))
        document.querySelector(".rentStatus").remove();
    const url = '/login/exp';
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        time = data.time;
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 토큰의 만료시간에 따른 타이머
 * 주요 기능 : 토큰의 만료시간을 시,분에 맞게 데이터 가공 후 1초마다 함수 실행
 */
const timmer = setInterval(function (){
    /** 만료시간 가공 */
    min = parseInt(time/60);
    sec = time%60
    document.getElementById("timmer").innerHTML = min + "분" + sec + "초";

    /** 만료시간 감소 */
    time--;
    if(time <0) {
        clearInterval(timmer);
        alert("토큰이 만료되었습니다.");
        logout(getCookie('token'));
    }
}, 1000);


/**
 * 담당자 : 박신욱
 * 함수 설명 : 만료시간을 연장하기위한 요청 API
 * 주요 기능 : 토큰 연장 API요청 후 만료시간 값 재설정
 */
function reToken() {
    const url = '/login/token';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({emp_no:localStorage.getItem('emp_no')})

    }).then(response => response.json()).then((data) => {
        console.log(data);
        time = data.time;
        alert(data.message);
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사이드 네브바의 검색기능
 * 주요 기능 : input의 값을 get으로 같이 실어서 url 이동
 */
function searchProduct() {
    let searchValue = document.getElementById("searchValue").value;
    if(searchValue){
        location.href = '/productManage/search/' + searchValue;
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사이드 네브바의 엔터 검색 기능
 * 주요 기능 : 엔터입력시 검색 함수 실행
 */
function enter() {
    if (window.event.keyCode == 13) {
        searchProduct();
    }
}