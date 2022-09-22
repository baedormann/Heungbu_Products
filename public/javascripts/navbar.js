let time = 0;

// 토큰 만료시간 api
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

// 토큰 타이머
const timmer = setInterval(function (){
    min = parseInt(time/60);
    sec = time%60

    document.getElementById("timmer").innerHTML = min + "분" + sec + "초";
    time--;
    if(time <0) {
        clearInterval(timmer);
        alert("토큰이 만료되었습니다.");
        logout(getCookie('token'));
    }
}, 1000);


// 연장
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

// 네브서치 이동
function searchProduct() {
    let searchValue = document.getElementById("searchValue").value;
    if(searchValue){
        location.href = '/productManage/search/' + searchValue;
    }
}

// 서치 엔터 클릭
function enter() {
    if (window.event.keyCode == 13) {
        searchProduct();
    }
}