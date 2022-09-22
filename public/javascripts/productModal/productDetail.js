/**
 * 담당자 : 박신욱
 * 함수 설명 : 매니저 권한 등록 권한에 따른 UI 표시
 */
if (!JSON.parse(localStorage.getItem('manage'))) {
    document.getElementsByClassName('manageOk')[0].style.display = "none";
}
if (!(JSON.parse(localStorage.getItem('edit_auth')) || JSON.parse(localStorage.getItem('manage')))) {
    document.getElementsByClassName('editOk')[0].style.display = "none";
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품 상세 모달 창
 * 주요 기능 : 모달창 띄우기 또는 선택한 물품의 데이터를 가져와 바인딩하는 기능
 */
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
        /** 대여 권한에 따른 대여화면 표시 */
        if (data.rental_availability && (JSON.parse(localStorage.getItem('rent_auth')) || (JSON.parse(localStorage.getItem('manage'))))) {
            document.getElementById("inputStart").innerHTML = `<div class="rentalTextDiv">시작일</div><input class="rentalInput" id="startDate" type="datetime-local" onchange="startEnd()">`
            document.getElementById("inputEnd").innerHTML = `<div class="rentalTextDiv">종료일</div><input class="rentalInput" id="endDate" type="datetime-local" onchange="startEnd()">`
            document.getElementById("inputText").innerHTML = `<div class="rentalTextDiv">대여 목적</div><input class="rentalInput" id="rentPurpose" type="text">`
            document.getElementById('rentalButton').innerHTML = `<button onClick="rental()">대여</button>`
            defaultStartEnd();
        } else {
            document.getElementsByClassName("rentalDiv")[0].innerHTML = "대여권한이 없습니다."
        }
        document.getElementsByClassName('product_code')[0].value = product_code;
        document.getElementsByClassName('product_id')[0].value = data._id;
        detail();
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대여화면에서 대여 시작일, 반납 예정일 초기값 설정
 * 주요 기능 : 대여시작일을 현재 시간을 기본값으로 설정하는 기능, 반납일을 시작일보다 높게 설정하는 기능
 */
function defaultStartEnd() {
    let startElement = document.getElementById('startDate');
    let endElement = document.getElementById('endDate');
    let date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    startElement.value = date;
    startElement.min = date;
    endElement.min = date;
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대여 시작일과 반납예정일의 유효성 체크 후 정상값으로 반환되는 함수
 * 주요 기능 : 시작일에따른 반납예정일의 최소값 설정, 반납예정일에따른 시작일의 최댓값 설정
 * 시작일이 반납예정일보다 높을경우 정상값 반환
 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대여를 등록하기위한 함수
 * 주요 기능 : 대여시 유효성검사와 대여에 필요한 데이터들을 가져와 대여 API요청
 */
function rental() {
    let start = document.getElementById('startDate');
    let end = document.getElementById('endDate');
    let text = document.getElementById('rentPurpose');
    let product_code = document.getElementsByClassName('product_code')[0].value;
    if (!end.value) return alert('반납일을 정해주세요.');
    /** 대여에 대한 데이터들을 가공 */
    const data = {
        product_code: product_code,
        emp_no: localStorage.getItem('emp_no'),
        purpose: text.value,
        start: start.value,
        end: end.value,
    }
    /** 대여 API 요청 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품삭제 하는 API 호출
 * 주요 기능 : confirm을통해 물품삭제 재확인후 삭제 API 요청
 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 대여자 명단 모달창을 나타내는 함수
 * 주요 기능 : 물품 대여자 명단 데이터를 모달창에 나타냄
 */
function rentalList() {
    /** 모달창 제목과 내용을 설정 */
    document.getElementById('modal-title').innerHTML = document.getElementById('product_name').value + ' 대여자 명단';
    document.getElementById('modal-rentalList').style.display = 'block';
    document.getElementById('modal-rental').style.display = 'none';

    /** 모달 안의 상세 내용을 설정 */
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('modal-productDetail');
    modalContent.classList.remove('modal-historyList');
    modalContent.classList.add('modal-rentalList');

    const productCode = document.getElementsByClassName('product_code')[0].value;

    /** 데이터 요청 */
    const url = '/productManage/rentalList';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({product_code: productCode})
    }).then(response => response.json()).then((data) => {
        /** thead에 들어갈 innerHTML 코드 작성 및 삽입 */
        let str = '';
        str += '<tr>';
        str += '<th>대여자명</th>';
        str += '<th>대여 사유</th>';
        str += '<th>대여일</th>';
        str += '<th>반납 기한</th>';
        str += '<th>대여 상태</th>';
        str += '</tr>';
        document.getElementsByClassName('rentalList__thead')[0].innerHTML = str;

        /** 변수 str 초기화, 대여명단 데이터 바인딩 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대여 이력 모달창을 나타내는 함수
 * 주요 기능 : 대여 이력 데이터를 모달창에 나타냄
 */
function history() {
    /** 모달창 제목과 내용을 설정 */
    document.getElementById('modal-title').innerHTML = document.getElementById('product_name').value + ' 대여 이력';
    document.getElementById('modal-rental').style.display = 'none';
    document.getElementById('modal-rentalList').style.display = 'block';

    /** 모달 안의 상세 내용을 설정 */
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('modal-productDetail');
    modalContent.classList.remove('modal-rentalList');
    modalContent.classList.add('modal-historyList');

    const productCode = document.getElementsByClassName('product_code')[0].value;

    /** 데이터 요청 */
    const url = '/productManage/rentalList';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({product_code: productCode})
    }).then(response => response.json()).then((data) => {
        /** thead에 들어갈 innerHTML 코드 작성 및 삽입 */
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

        /** 변수 str 초기화, 데이터 바인딩 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대여자 명단 모달창을 나타내는 함수
 * 주요 기능 : 대여자 명단 데이터를 모달창에 나타냄
 */
function detail() {
    document.getElementById('modal-rental').style.display = 'block';
    document.getElementById('modal-rentalList').style.display = 'none';
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('modal-historyList');
    modalContent.classList.remove('modal-rentalList');
    modalContent.classList.add('modal-productDetail');
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 모달창내의 뒤로가기 기능
 * 주요 기능 : 모달데이터 함수 재요청후 대여현황, 이력 html 초기화
 */
function back() {
    detail();
    document.getElementsByClassName('rentalList__thead')[0].innerHTML = '';
    document.getElementsByClassName('rentalList__tbody')[0].innerHTML = '';
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 수정 페이지로 이동하는 함수
 * 주요 기능 : 물품 코드를 파라미터로 가지고 물품 수정 페이지 GET요청
 */
function edit() {
    const product_code = document.getElementsByClassName('product_code')[0].value;
    location.href = '/productManage/edit/' + product_code;
}
