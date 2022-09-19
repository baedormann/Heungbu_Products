// 비밀번호 유효성 검사
function passwordKeyUp() {
    let elMismatchmessage = document.querySelector('.mismatch-message');
    if (document.getElementById("newPassword").value.length < 4) {
        elMismatchmessage.style.visibility = "visible"
    } else {
        elMismatchmessage.style.visibility = "hidden"
    }
}

// 유저 정보 수정
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

// 비밀번호 정보 수정
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

