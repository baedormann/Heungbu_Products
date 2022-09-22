/**
 * 담당자 : 박신욱
 * 함수 설명 : 내정보 수정에서의 비밀번호 유효성 검사
 * 주요 기능 : 새 비밀번호가 4자리 미만 일경우 에러 메세지 표시 및 숨김
 */
function passwordKeyUp() {
    let elMismatchmessage = document.querySelector('.mismatch-message');
    if (document.getElementById("newPassword").value.length < 4) {
        elMismatchmessage.style.visibility = "visible"
    } else {
        elMismatchmessage.style.visibility = "hidden"
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 유저정보를 수정하는 API 요청
 * 주요 기능 : 수정할 데이터를 가공후 수정 API 요청
 */
function userUpdate(emp_no) {
    const data = {
        emp_no: emp_no,
        emp_name: document.getElementById("emp_name").value,
        dept: document.getElementById("dept").value,
        emp_position: document.getElementById("emp_position").value
    }
    const url = '/myPage/modify';
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify(data)
    }).then(response => {
        alert('유저 정보가 수정되었습니다.');
        location.href = '/myPage';
    }).catch(e => console.log(e));
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 비밀번호를 수정하는 API를 요청 하는 함수
 * 주요 기능 : 비밀번호 유효성 검사후 각 비밀번호데이터를 가져와 비밀번호 수정 API요청
 */
function passwordUpdate(emp_no) {
    if (document.getElementById("newPassword").value.length < 4) {
        return alert("비밀번호는 4자리 이상입니다.");
    }
    const password = document.getElementById('password').value;
    const newPassword = document.getElementById('newPassword').value;
    const url = '/myPage/modify/password';
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({password: password, emp_no: emp_no, newPassword: newPassword})
    }).then(response => {
        /** 현재 비밀번호가 정확하지 않을경우 201요청을 통해 에러 처리 */
            if (response.status == 201) {
                throw alert("현재 비밀번호를 정확히 입력해주세요.");
            }
            return response.json()
        }
    ).then(data => {
        alert(data.message);
        location.href = '/myPage';
    })
        .catch(e => console.log(e));
}

