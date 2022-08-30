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
        console.log(data);
        location.href = '/test';
    });
}
