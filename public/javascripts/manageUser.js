// manage 모달관리
var modal = document.getElementById('manageModal');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 이용자관리의 사용자에 대한 모달창 표시
 * 주요 기능 : 사번을 매게변수로 사용자상세정보 요청 API호출후 데이터 바인딩
 */
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
        document.getElementById("e_num").innerHTML = data.emp_no;
        document.getElementById("e_name").innerHTML = data.emp_name;
        document.getElementById("e_dept").innerHTML = data.dept;
        document.getElementById("e_position").innerHTML = data.emp_position;
        document.getElementById("e_email").innerHTML = data.email;
        document.getElementById("p_edit").innerHTML = data.edit_auth ? "<input id='e_edit' type='checkbox' checked=data.rent_edit>" : "<input id='e_edit' type='checkbox'>";
        document.getElementById("p_rent").innerHTML = data.rent_auth ? "<input id='e_rent' type='checkbox' checked=data.rent_auth>" : "<input id='e_rent' type='checkbox'>";
        document.getElementById("p_open").innerHTML = data.open_auth ? "<input id='e_open' type='checkbox' checked=data.open_auth>" : "<input id='e_open' type='checkbox'>";
        document.getElementById("save_button").innerHTML = `<button class="btn-primary" onclick=saveAuth('${emp_no}')>저장</button>`;
        document.getElementById("ben_button").innerHTML = `<button class="btn-red" onclick=userBen('${data._id}')>추방</button>`;
        document.getElementById("init_button").innerHTML = `<button class="btn-empty" onclick="userInit('${emp_no}')">비밀번호 초기화</button>`;
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자 모달창 닫기
 * 주요 기능 : 모달창의 속성을 none으로 주어 닫기기능
 */
function manageDone() {
    modal.style.display = "none";
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 모달창 닫기기능
 * 주요 기능 : 모달창 띄었을때 다른곳 누를시 모달창 스타일 none
 */
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자에 대한 권한 부여및 회수
 * 주요 기능 : 사번을 매게변수로 받아 보낼 데이터 가공 후 권한 수정 API 요청
 */
function saveAuth(emp_no) {
    console.log(emp_no)
    const data = {
        emp_no: emp_no,
        edit_auth: document.getElementById("e_edit").checked,
        rent_auth: document.getElementById("e_rent").checked,
        open_auth: document.getElementById("e_open").checked
    }
    const url = '/manageUser';
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then((data) => {
        alert('권한을 수정하였습니다.', true);
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 선택된 사용자의 비밀번호 초기화 함수
 * 주요 기능 : confirm으로 재 확인후 사번으로 비밀번호 초기화 API 요청
 */
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


/**
 * 담당자 : 박신욱
 * 함수 설명 : 선택된 사용자를 추방하는 기능
 * 주요 기능 : 파라미터로 사번을 넣고 추방 API요청
 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 조건의 맞는 사용자 검색 함수
 * 주요 기능 : 사용자 검색 API를 요청해 response된 데이터들을 각 요소에 맞게 바인딩
 */
function manageSearch() {
    let selectSearch = document.getElementById("select_search");
    let text = document.getElementById("input_text");
    let tableData = document.getElementById("table_data");
    const url = '/manageUser/search';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({
            "condition": selectSearch.value,
            "text": text.value,
        })
    }).then(response => response.json()).then((data) => {
        let innerTable = [];
        data.data.map(res => {
            innerTable.push(
                `<tr>`
                + `<td>${res.emp_no}</td>`
                + `<td>${res.emp_name}</td>`
                + `<td>${res.dept}</td>`
                + `<td>${res.emp_position}</td>`
                + `<td>${res.email} </td>`
                + `<td>${res.edit_auth ? 'O' : 'X'}</td>`
                + `<td>${res.rent_auth ? 'O' : 'X'}</td>`
                + `<td>${res.open_auth ? 'O' : 'X'}</td>`
                + `<td><button onclick="manageOpen('${res.emp_no}')">관리</button></td>`
                + "</tr>"
            )
        });
        tableData.innerHTML = innerTable.join("");
        text.value = '';
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 이용자 검색
 * 주요 기능 : 엔터 키 입력시 이용자 검색 함수 요청
 */
function searchEnter() {
    if (window.event.keyCode == 13) {
        manageSearch();
    }
}