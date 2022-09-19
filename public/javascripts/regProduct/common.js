// 물품등록 api
function regProduct() {
    if (!Boolean(document.getElementById("firstCategory").value)) {
        return alert("대분류를 선택하세요");
    } else if (!Boolean(document.getElementById("secondCategory").value)) {
        return alert("소분류를 선택하세요");
    } else if (!Boolean(document.getElementById("product_code").value)) {
        return alert("물품코드를 입력하세요");
    } else if (!Boolean(document.getElementById("product_name").value)) {
        return alert("물품명을 입력하세요");
    } else if (!Boolean(document.getElementById("quantity").value)) {
        return alert("수량을 입력하세요");
    }
    regProductApi()
}

// 대여 라디오 값 반환
function rental_availability() {
    const rental_availability_arr = document.getElementsByName('rental_availability');

    if (rental_availability_arr[0].checked == true) {
        return true;
    } else {
        return false;
    }
}

// 반환 라디오 값 반환
function return_needed() {
    //반환 필요 여부, return_needed 값 설정
    const return_needed_arr = document.getElementsByName('return_needed');
    if (return_needed_arr[0].checked == true) {
        return true;
    } else {
        return false;
    }
}

//수량 유효성 검사
function underZero() {
    let number = document.getElementById('quantity').value;
    if (number < 0) {
        document.getElementById('quantity').value = 0;
        alert('0 이상의 수량을 입력하세요.')
    }
    if (number % 1 > 0) {
        document.getElementById('quantity').value = 0;
        alert('수량을 정수 형태로 입력하세요.')
    }
}

//대분류 선택 시 소분류 조회
function findSecondCategory(firstCategory) {
    document.getElementById('secondCategory').disabled = false;
    let selectedElement = document.getElementById("firstCategory");
    let optionVal = selectedElement.options[selectedElement.selectedIndex].value;

    let url = '/regProduct/findSecondCategory/' + optionVal;
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        let str = '<option id="second_category_default" value="" disabled>선택</option>';
        for (var i = 0; i < data[0].secondCategory.length; i++) {
            str += '<option id="" value="' + data[0].secondCategory[i] + '">' + data[0].secondCategory[i] + '</option>';
        }
        document.getElementById('secondCategory').innerHTML = str;
    });
}