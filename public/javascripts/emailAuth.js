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
        }).catch((err) => {
            alert("인증번호보내기가 실패하였습니다.");
        });
    } else {
        return alert("이메일을 형식에맞게 입력해주세요.")
    }
}

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