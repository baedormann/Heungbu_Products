// 권한에 따른 UI
if (!JSON.parse(localStorage.getItem('manage'))) {
    document.getElementsByClassName('manageOk')[0].style.display = "none";
}

if (!(JSON.parse(localStorage.getItem('edit_auth')) || JSON.parse(localStorage.getItem('manage')))) {
    document.getElementsByClassName('editOk')[0].style.display = "none";
}

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
        document.getElementById("inputStart").innerHTML = ``
        document.getElementById("inputEnd").innerHTML = ``
        document.getElementById("inputText").innerHTML = ``
        document.getElementById('rentalButton').innerHTML = ``
        document.getElementById("product_name").innerHTML = `${data.product_name}`
        document.getElementById("product_name").value = `${data.product_name}`
        document.getElementById("product_category").innerHTML = `${data.product_category.firstCategory} - ${data.product_category.secondCategory}`
        document.getElementById("product_code").innerHTML = `${data.product_code}`
        document.getElementById("rental_availability").innerHTML = ` ${data.rental_availability ? 'O' : 'X'}`
        document.getElementById("return_needed").innerHTML = `${data.return_needed ? 'O' : 'X'}`
        document.getElementById("quantity").innerHTML = `${data.leftQuantity}`
        if (data.rental_availability && (JSON.parse(localStorage.getItem('rent_auth')) || (JSON.parse(localStorage.getItem('manage'))))) {
            document.getElementById("inputStart").innerHTML = `<div class="rentalTextDiv">시작일</div><input class="rentalInput" id="startDate" type="datetime-local" onchange="startEnd()">`
            document.getElementById("inputEnd").innerHTML = `<div class="rentalTextDiv">종료일</div><input class="rentalInput" id="endDate" type="datetime-local" onchange="startEnd()">`
            document.getElementById("inputText").innerHTML = `<div class="rentalTextDiv">대여 목적</div><input class="rentalInput" id="rentPurpose" type="text">`
            document.getElementById('rentalButton').innerHTML = `<button onClick="rental()">대여</button>`
            defaultStartEnd();
        }
        document.getElementsByClassName('product_code')[0].value = product_code;
        document.getElementsByClassName('product_id')[0].value = data._id;
        detail();
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
    let product_code = document.getElementsByClassName('product_code')[0].value;
    if (!end.value) return alert('반납일을 정해주세요.');
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
    }).then(response => {
        if (response.status == 402) {
            throw alert('수량이 없습니다.');
        } else if (response.status == 400) {
            throw alert('대여에 실패하였습니다.')
        }
        return response.json()
    }).then((data) => {
        alert(`대여하셨습니다.`);
        location.reload();
    })
}

// 물품 삭제
function productDelete() {
    const product_id = document.getElementsByClassName('product_id')[0].value;
    const url = '/productManage/' + product_id;
    if (confirm("정말 삭제하시겠습니까?") == true) {
        fetch(url, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie('token')
            }
        }).then(response => {
            if (response.status == 402) {
                throw alert('물품 삭제에 실패하였습니다.');
            }
        }).then((data) => {
            alert(`삭제되었습니다`);
            location.reload();
        }).catch(err => {
            console.log(err);
        })
    }
}

// 대여자 명단 모달창 띄우기
function rentalList() {
    document.getElementById('modal-title').innerHTML = document.getElementById('product_name').value + ' 대여자 명단';
    document.getElementById('modal-rentalList').style.display = 'block';
    document.getElementById('modal-rental').style.display = 'none';

    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('modal-productDetail');
    modalContent.classList.remove('modal-historyList');
    modalContent.classList.add('modal-rentalList');

    const productCode = document.getElementsByClassName('product_code')[0].value;

    const url = '/productManage/rentalList';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({product_code: productCode})
    }).then(response => response.json()).then((data) => {
        //thead의 innerHTML 코드 작성
        let str = '';
        str += '<tr>';
        str += '<th>대여자명</th>';
        str += '<th>대여 사유</th>';
        str += '<th>대여일</th>';
        str += '<th>반납 기한</th>';
        str += '<th>대여 상태</th>';
        str += '</tr>';
        document.getElementsByClassName('rentalList__thead')[0].innerHTML = str;
        //변수 str 초기화
        str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<tr>';
            str += '<td>' + data[i].emp_id.emp_name + '</td>';
            str += '<td>' + (data[i].rental_purpose ? data[i].rental_purpose : '-') + '</td>';
            str += '<td>' + data[i].rental_date.split('T')[0] + ' ' + data[i].rental_date.split('T')[1].slice(0, 5) + '</td>';
            str += '<td>' + data[i].return_deadline.split('T')[0] + ' ' + data[i].return_deadline.split('T')[1].slice(0, 5) + '</td>';
            str += '<td>' + data[i].rental_status + '</td>';
            str += '</tr>';
        }
        document.getElementsByClassName('rentalList__tbody')[0].innerHTML = str;
    });
}

// 대여이력 모달창 띄우기
function history() {
    document.getElementById('modal-title').innerHTML = document.getElementById('product_name').value + ' 대여 이력';
    document.getElementById('modal-rental').style.display = 'none';
    document.getElementById('modal-rentalList').style.display = 'block';

    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('modal-productDetail');
    modalContent.classList.remove('modal-rentalList');
    modalContent.classList.add('modal-historyList');

    const productCode = document.getElementsByClassName('product_code')[0].value;

    const url = '/productManage/rentalList';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({product_code: productCode})
    }).then(response => response.json()).then((data) => {
        let str = '';
        str += '<tr>';
        str += '<th>상태</th>';
        str += '<th>분류</th>';
        str += '<th>물품명</th>';
        str += '<th>물품 코드</th>';
        str += '<th>대여자명</th>';
        str += '<th>대여 사유</th>';
        str += '<th>대여일</th>';
        str += '<th>반납일</th>';
        str += '</tr>';
        document.getElementsByClassName('rentalList__thead')[0].innerHTML = str;

        //변수 str 초기화
        str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<tr>';
            str += '<td>' + data[i].rental_status + '</td>';
            str += '<td>' + data[i].product_id.product_category.firstCategory + '<br>' + data[i].product_id.product_category.secondCategory + '</td>';
            str += '<td>' + data[i].product_id.product_name + '</td>';
            str += '<td>' + data[i].product_code + '</td>';
            str += '<td>' + data[i].emp_id.emp_name + '</td>';
            str += '<td>' + (data[i].rental_purpose ? data[i].rental_purpose : '-') + '</td>';
            str += '<td>' + data[i].rental_date.split('T')[0] + ' ' + data[i].rental_date.split('T')[1].slice(0, 5) + '</td>';
            data[i].return_date ? str += '<td>' + data[i].return_date.split('T')[0] + ' ' + data[i].return_date.split('T')[1].slice(0, 5) + '</td>' : str += '<td>-</td>';
            str += '</tr>';
        }
        document.getElementsByClassName('rentalList__tbody')[0].innerHTML = str;

    });
}

// 물품 대여 모달창 띄우기
function detail() {
    document.getElementById('modal-rental').style.display = 'block';
    document.getElementById('modal-rentalList').style.display = 'none';
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('modal-historyList');
    modalContent.classList.remove('modal-rentalList');
    modalContent.classList.add('modal-productDetail');
}

//뒤로가기
function back() {
    detail();
    document.getElementsByClassName('rentalList__thead')[0].innerHTML = '';
    document.getElementsByClassName('rentalList__tbody')[0].innerHTML = '';
}

//물품편집 화면으로 이동
function edit() {
    const product_code = document.getElementsByClassName('product_code')[0].value;
    location.href = '/productManage/edit/' + product_code;
}
