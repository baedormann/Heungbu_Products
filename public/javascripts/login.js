// 로그인 요청 api
function login() {
    const user = {
        emp_no: document.getElementById("emp_no").value,
        password: document.getElementById("password").value
    };
    const url = "/login"

    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    }).then(response => response.json()).then((data) => {
        alert(data.message);
        console.log(data);
        localStorage.setItem('emp_no', data.data.emp_no);
        localStorage.setItem('emp_name', data.data.emp_name);
        localStorage.setItem('manage', data.data.manage);
        localStorage.setItem('edit_auth', data.data.edit_auth);
        localStorage.setItem('rent_auth', data.data.rent_auth);
        localStorage.setItem('open_auth', data.data.open_auth);
        location.href = '/';
    }).catch(err => console.log(err));
}

// 엔터 클릭
function enter() {
    if (window.event.keyCode == 13) {
        login();
    }
}