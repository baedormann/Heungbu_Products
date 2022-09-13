// 물품 상세 화면
function productModalOpen(product_code) {
    var modal = document.getElementById('productModal');
    modal.style.display = "block";
    const url = '/productManage/' + product_code;
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        document.getElementById("product_name").innerHTML = `물품 이름 : ${data.product_name}`
        document.getElementById("product_category").innerHTML = `대분류 : ${data.product_category.firstCategory} 소분류 : ${data.product_category.secondCategory}`
        document.getElementById("product_code").innerHTML = `물품코드 : ${data.product_code}`
        document.getElementById("hiddenCode").value = `${data.product_code}`
        document.getElementById("rental_availability").innerHTML = `대여 여부 : ${data.rental_availability}`
        document.getElementById("return_needed").innerHTML = `반납 여부 : ${data.return_needed}`
        document.getElementById("quantity").innerHTML = `물품 수량 : ${data.quantity}`
        document.getElementById("inputStart").innerHTML = `시작일 : <input id="startDate" type="datetime-local" onchange="startEnd()">`
        document.getElementById("inputEnd").innerHTML = `종료일 : <input id="endDate" type="datetime-local" onchange="startEnd()">`
        document.getElementById("inputText").innerHTML = `대여 목적 : <input id="rentPurpose" type="text">`
        document.getElementById('product_code').value = product_code;
        defaultStartEnd();
    });
}

// 시작일 종료일 기본값
function defaultStartEnd() {
    let startElement = document.getElementById('startDate');
    let endElement = document.getElementById('endDate');
    let date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    startElement.value = date;
    startElement.min = date;
    endElement.min = date;
}

// 시작일 종료일
function startEnd() {
    let start = document.getElementById('startDate');
    let end = document.getElementById('endDate');
    if (start.value)
        end.min = start.value;
    if (end.value)
        start.max = end.value;
    if (start.value > end.value) {
        alert('반납일을 다시 정해주세요.');
        end.value = start.value;
    }
}

// 대여
function rental() {
    let start = document.getElementById('startDate');
    let end = document.getElementById('endDate');
    let text = document.getElementById('rentPurpose');
    let product_code = document.getElementById('product_code').value;
    if(!end.value) return alert('반납일을 정해주세요.');
    const data = {
        product_code: product_code,
        emp_no: localStorage.getItem('emp_no'),
        purpose: text.value,
        start: start.value,
        end: end.value,
    }
    const url = '/rental';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then((data) => {
        alert(`대여하셨습니다.`);
        location.reload();
    });
}
