/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입시 이메일 유효성 검사
 * 주요 기능 : @와 .텍스트가 포함되도록 하는 유효성검사와 에러 메세지 표시및 숨김
 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 비밀번호 유효성 검사하는 기능
 * 주요 기능 : 비밀번호가 4자리이상과 비밀번호와 비밀번호 확인이 다를경우 에러메세지 표시및 숨김
 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 비밀번호와 비밀번호확인유효성 검사를통해 리턴값 적용
 * 주요 기능 : 두패스워드가 같을경우 true 다를경우 false를 반환 하여 재사용하기위한 함수
 */
function isMatch (password1, password2) {
    if(password1 === password2) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입의 전체적인 유효성검사 및 회원등록 API 요청
 * 주요 기능 : 전체적인 회원가입 데이터에대한 유효성 검사와 요청할 데이터가공, 에러처리
 */
function auth() {
    /** 전체적인 유효성 검사 */
    if(!Boolean(document.getElementById("emp_no").value)){
        return alert("사번을 입력하세요");
    }else if(!Boolean(document.getElementById("emp_name").value)){
        return alert("이름을 입력하세요");
    }else if(Boolean(document.getElementById("emp_position").value == '')){
        return alert("직급을 선택하세요");
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
    /** 회원등록 요청 API */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입에대한 엔터키 처리
 * 주요 기능 : 입력한키가 엔터라면 회원가입 함수 실행
 */
function enter() {
    if(window.event.keyCode == 13) {
        auth();
    }
}
