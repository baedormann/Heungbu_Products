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
        localStorage.setItem("name", data.data.emp_name);
        localStorage.setItem("authorization", data.data.authorization);
        location.href = '/';
    }).catch(err => console.log(err));
}
