// 이메일 유효성 검사
function emailKeyUp() {
    let elMismatchmessage = document.querySelector('.mismatch-message-email');
    if (document.getElementById('email').value.indexOf('@')==-1 || document.getElementById('email').value.indexOf('.')==-1) {
        elMismatchmessage.style.visibility = "visible"
        return false;
    }
    else {
        elMismatchmessage.style.visibility = "hidden"
        return true;
    }
}

// 비밀번호 유효성 검사
function passwordKeyUp() {
    let elMismatchmessage = document.querySelector('.mismatch-message');
    if(document.getElementById("password").value.length<4){
        elMismatchmessage.style.visibility = "visible"
        elMismatchmessage.innerText="4자리 이상이 필요합니다."
    }else{
        elMismatchmessage.innerText="두 비밀번호가 일치하지 않습니다."
        if(isMatch(document.getElementById("password").value, document.getElementById("passwordCheck").value)) {
            elMismatchmessage.style.visibility = "hidden"
            return true;
        }
        else {
            elMismatchmessage.style.visibility = "visible"
            return false;
        }
    }
}

// 비밀번호 확인
function isMatch (password1, password2) {
    if(password1 === password2) {
        return true;
    }
    else {
        return false;
    }
}

// 회원가입 api
function auth() {
    if(!Boolean(document.getElementById("emp_no").value)){
        return alert("사번을 입력하세요");
    }else if(!Boolean(document.getElementById("emp_name").value)){
        return alert("이름 입력하세요");
    }
    if(!emailKeyUp() || !passwordKeyUp() || document.getElementById('password').value.length < 4){
        return alert("회원가입형식에 맞게 입력해주세요.");
    }
    const url = "/auth"
    let select_postion = document.getElementById("emp_position");
    const user = {
        emp_no: document.getElementById("emp_no").value,
        password: document.getElementById("password").value,
        emp_name: document.getElementById("emp_name").value,
        dept: document.getElementById("dept").value,
        emp_position: select_postion.options[select_postion.selectedIndex].value,
        email: document.getElementById("email").value
    };
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    }).then(response => {
        const { status } = response;
        if(status == 400) {
            alert("중복된 사번 입니다.")
        }else{
            return response.json()
        }
    }).then((data) => {
        alert(data.message);
        console.log(data);
        location.href = '/login';
    }).catch((err) => {
        console.log(err);
        alert("회원가입에 실패하셨습니다.");
    });
}
