// manage 모달관리
var modal = document.getElementById('manageModal');

function manageOpen(emp_no) {
    modal.style.display = "block";
    const url = '/member/auth/' + emp_no;
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        document.getElementById("e_num").innerHTML = "사번 : " + data.emp_no;
        document.getElementById("e_name").innerHTML = "이름 : " + data.emp_name;
        document.getElementById("e_dept").innerHTML = "부서 : " + data.dept;
        document.getElementById("e_position").innerHTML = "직책 : " + data.emp_position;
        document.getElementById("e_email").innerHTML = "이메일 : " + data.email;
        document.getElementById("p_edit").innerHTML = "<input id='e_edit' type='checkbox' data.edit_auth ? checked : null >" + "편집 권한"
        document.getElementById("p_rent").innerHTML = data.rent_auth ? "<input id='e_rent' type='checkbox' checked=data.rent_auth>" + "대여 권한" : "<input id='e_rent' type='checkbox'>" + "대여 권한";
        document.getElementById("p_open").innerHTML = data.open_auth ? "<input id='e_open' type='checkbox' checked=data.open_auth>" + "열람 권한" : "<input id='e_open' type='checkbox'>" + "열람 권한";
        document.getElementById("ben_button").innerHTML = "<button onclick=userBen(" + data.emp_no + ")>추방</button>";
    });
}

function manageDone() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 유저 추방
function userBen(emp_no) {
    const url = '/member/auth/' + emp_no;
    fetch(url, {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        console.log(data);
    });
}