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
        document.getElementById("p_edit").innerHTML = data.edit_auth ? "<input id='e_edit' type='checkbox' checked=data.rent_edit>" + "편집 권한" : "<input id='e_edit' type='checkbox'>" + "편집 권한";
        document.getElementById("p_rent").innerHTML = data.rent_auth ? "<input id='e_rent' type='checkbox' checked=data.rent_auth>" + "대여 권한" : "<input id='e_rent' type='checkbox'>" + "대여 권한";
        document.getElementById("p_open").innerHTML = data.open_auth ? "<input id='e_open' type='checkbox' checked=data.open_auth>" + "열람 권한" : "<input id='e_open' type='checkbox'>" + "열람 권한";
        document.getElementById("save_button").innerHTML = `<button onclick=saveAuth('${emp_no}')>저장</button>`;
        document.getElementById("ben_button").innerHTML = `<button onclick=userBen('${data._id}')>추방</button>`;
        document.getElementById("init_button").innerHTML = `<button onclick="userInit('${emp_no}')">비밀번호 초기화</button>`;
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

// 권한 부여 및 회수
function saveAuth(emp_no) {
    console.log(emp_no)
    const data = {
        emp_no: emp_no,
        edit_auth: document.getElementById("e_edit").checked,
        rent_auth: document.getElementById("e_rent").checked,
        open_auth: document.getElementById("e_open").checked
    }
    console.log(data);
    const url = '/manageUser';
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then((data) => {
        alert('권한을 수정하였습니다.');
        location.reload();
    });
}

// 비밀번호 초기화
function userInit(emp_no) {
    if (confirm("비밀번호를 초기화 하시겠습니까?") == true) {
        const url = '/manageUser/init';
        fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie('token')
                },
                body: JSON.stringify({emp_no: emp_no})
            }
        ).then(response => response.json()).then((data) => {
            alert('초기화 되었습니다.');
            location.reload();
        });
    } else {
        return;
    }
}


// 유저 추방
function userBen(emp_no) {
    if (confirm("정말 추방하시겠습니까?") == true) {
        const url = '/member/auth/' + emp_no;
        fetch(url, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie('token')
            }
        }).then(response => response.json()).then((data) => {
            alert('추방되었습니다.');
            location.reload();
        });
    } else {
        return;
    }

}