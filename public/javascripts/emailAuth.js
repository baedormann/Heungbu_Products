document.getElementsByClassName("wrapper")[0].classList.add('current');
let emailSuccess = false;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입시 이메일 유효성 검사
 * 주요 기능 : @와 .텍스트가 포함되도록 하는 유효성검사와 에러 메세지 표시및 숨김
 */
function emailKeyUp() {
    let elMismatchmessage = document.querySelector('.mismatch-message-email');
    if (document.getElementById('emailInput').value.indexOf('@') == -1 || document.getElementById('emailInput').value.indexOf('.') == -1) {
        elMismatchmessage.style.visibility = "visible"
        return false;
    } else {
        elMismatchmessage.style.visibility = "hidden"
        return true;
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원가입시 이메일로 인증번호를 요청하는 함수
 * 주요 기능 : 이메일 인증번호 요청을 보낸후 인증번호 유효시간 타이머 실행
 */
function emailAuth() {
    if (emailKeyUp()) {
        const url = "/auth/email"
        fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: document.getElementById('emailInput').value})
        }).then(response =>
            response.json()
        ).then((data) => {
            alert(data.message);
            if(data.message == "인증번호를 요청하였습니다."){
                stopWatch(180);
                document.getElementsByClassName("sendBtn")[0].disabled = true;
                document.getElementById("emailInput").disabled = true;
            }
        }).catch((err) => {
            alert("인증번호보내기가 실패하였습니다.");
        });
    } else {
        return alert("이메일을 형식에맞게 입력해주세요.")
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 이메일로받은 인증번호로 검증하는 요청을 보내는 함수
 * 주요 기능 : 인증번호 처리가 완료되었을 경우 회원가입 페이지 표시
 */
function authGo() {
    let emailComponent = document.getElementsByClassName("wrapper__email")[0];
    let authComponent = document.getElementsByClassName("wrapper__auth")[0];

    const url = "/auth/email/success"
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({CEA: document.getElementById('codeCheck').value})
    }).then(response => response.json()
    ).then((data) => {
            if (data.result) {
                alert("인증이 성공하였습니다.");
                emailSuccess = true;
                document.getElementById("email").value = document.getElementById('emailInput').value;
                document.getElementsByClassName("wrapper")[0].classList.remove('current');
                document.getElementsByClassName("wrapper")[1].classList.add('current');
                emailComponent.style.display = "none";
                authComponent.style.display = "block";
            } else {
                alert("인증번호를 다시입력해주세요.");
            }
        }
    ).catch((err) => {
        console.log(err);
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 인증번호 유효기간 타이머 함수
 * 주요 기능 : 인증번호 유효기간을 타이머로두고 유효기간 동안의 전송 버튼 처리
 */
function stopWatch(time) {
    email_timmer = setInterval(function () {
        min = parseInt(time/60);
        sec = time%60;
        document.getElementsByClassName("sendBtn")[0].innerHTML = min + "분" + sec + "초";
        time--;
        if(time <0) {
            document.getElementsByClassName("sendBtn")[0].disabled = false;
            document.getElementsByClassName("sendBtn")[0].innerHTML = "전송";
            document.getElementById("emailInput").disabled=false;
            clearInterval(email_timmer);
        }
    }, 1000);
}