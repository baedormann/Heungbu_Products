/**
 * 담당자 : 배도훈
 * 함수 설명 : 대여자 명단 모달창을 나타내는 함수
 * 주요 기능 : 대여자 명단 데이터를 모달창에 나타냄
 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대여 가능 여부 라디오버튼 값을 반환하는 함수
 * 주요 기능 : 대여 가능 여부 라디오버튼 값을 반환
 */
function rental_availability() {
    /** 대여가능여부 라디오버튼 객체 생성 */
    const rental_availability_arr = document.getElementsByName('rental_availability');

    /** '가능'에 체크된 경우 */
    if (rental_availability_arr[0].checked == true) {
        return true;
    /** '불가능'에 체크된 경우 */
    } else {
        return false;
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대여 가능 여부 라디오버튼 값을 반환하는 함수
 * 주요 기능 : 대여 가능 여부 라디오버튼 값을 반환
 */
function return_needed() {
    /** 대여가능여부 라디오버튼 객체 생성 */
    const return_needed_arr = document.getElementsByName('return_needed');
    /** '불가능'에 체크된 경우 */
    if (return_needed_arr[0].checked == true) {
        return true;
    } else {
        return false;
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 수량 유효성 검사 함수
 * 주요 기능 : 물품 수량이 음수이거나 소수일 경우 수량을 0으로 처리하고 alert 표시
 */
function underZero() {
    let number = document.getElementById('quantity').value;
    /** 수량이 음수일 경우 */
    if (number < 0) {
        document.getElementById('quantity').value = 0;
        alert('0 이상의 수량을 입력하세요.')
    }
    /** 수량이 소수일 경우 */
    if (number % 1 > 0) {
        document.getElementById('quantity').value = 0;
        alert('수량을 정수 형태로 입력하세요.')
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대분류 선택 시 해당 대분류 하위의 소분류를 조회하는 함수
 * 주요 기능 :
 */
function findSecondCategory(firstCategory) {
    /** 대분류 선택 시 소분류 select를 활성화 */
    document.getElementById('secondCategory').disabled = false;

    /** 선택된 대분류 객체 설정 */
    let selectedElement = document.getElementById("firstCategory");
    let optionVal = selectedElement.options[selectedElement.selectedIndex].value;

    /** 선택된 대분류의 하위 소분류를 조회하는 api 호출 */
    let url = '/regProduct/findSecondCategory/' + optionVal;
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        let str = '<option id="second_category_default" value="" disabled>선택</option>';

        /** 조회한 소분류 데이터 바인딩 */
        for (var i = 0; i < data[0].secondCategory.length; i++) {
            str += '<option id="" value="' + data[0].secondCategory[i] + '">' + data[0].secondCategory[i] + '</option>';
        }
        document.getElementById('secondCategory').innerHTML = str;
    });
}