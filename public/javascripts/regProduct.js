// 물품등록 api
function regProduct() {
    console.log(document.getElementById("firstCategory").value);
    if(!Boolean(document.getElementById("firstCategory").value)){
        return alert("대분류를 선택하세요");
    }else if(!Boolean(document.getElementById("secondCategory").value)){
        return alert("소분류를 선택하세요");
    }
    /*if(!emailKeyUp() || !passwordKeyUp() || document.getElementById('password').value.length < 4){
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
    });*/
}

// 엔터 클릭
/*
function enter(){
    if(window.event.keyCode == 13) {
        auth();
    }
}*/
