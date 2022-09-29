/**
 * 담당자 : 배도훈
 * 함수 설명 : 초기화를 위해 기존의 물품 상세정보를 저장
 * 주요 기능 : 페이지 로드 시 초기화되는 변수들 선언
 */
const firstCategory = document.getElementById('firstCategoryHidden').value;
const secondCategory = document.getElementById('secondCategoryHidden').value;
const productName = document.getElementById('product_name').value;
const quantity = document.getElementById('quantity').value;
let rentalAvailability;
let returnNeeded;

/** 대여가능여부 초기화 */
if (document.getElementById('rentalAvailailityHidden').value == 'true') {
    rentalAvailability = true;
}
else {
    rentalAvailability = false;
}

/** 반환필요여부 초기화 */
if (document.getElementById('returnNeededHidden').value == 'true') {
    returnNeeded = true;
} else {
    returnNeeded = false;
}

/** 초기화 함수 실행 */
initReg();

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 편집 시 유효성 검사를 실행하는 함수
 * 주요 기능 : 대분류, 소분류, 물품명, 수량 null 체크 후 alert 메시지 처리
 */
function editProduct() {
    if (!Boolean(document.getElementById("firstCategory").value)) {
        return alert("대분류를 선택하세요");
    } else if (!Boolean(document.getElementById("secondCategory").value)) {
        return alert("소분류를 선택하세요");
    } else if (!Boolean(document.getElementById("product_name").value)) {
        return alert("물품명을 입력하세요");
    } else if (!Boolean(document.getElementById("quantity").value)) {
        return alert("수량을 입력하세요");
    }

    /** 물품 편집 api를 호출하는 함수 실행 */
    editProductApi();
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 편집 API 를 요청하는 함수
 * 주요 기능 : 물품 편집 API 요청, 라우터에서 유효성 검사 실행 후 반환된 결과 메세지 표시
 */
function editProductApi() {
    let url = "/editProduct"
    let product = {
        firstCategory: document.getElementById("firstCategory").value,
        secondCategory: document.getElementById("secondCategory").value,
        product_code: document.getElementById("product_code").value,
        product_name: document.getElementById("product_name").value,
        quantity: document.getElementById("quantity").value,
        rental_availability: rental_availability(),
        return_needed: return_needed()
    };
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
    }).then(response => {
        /** 400번에러에 관해서 중복된 물품 에러 처리 */
        const {status} = response;
        if (status == 400) {
            alert("중복된 물품코드입니다.")
        } else {
            return response.json()
        }
    }).then((data) => {
        /** 성공 시 alert 표시 및 새로고침 */
        alert(data.message);
        console.log(data, true);
    }).catch((err) => {
        console.log(err);
        alert("물품등록에 실패했습니다.");
    });
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 초기화 버튼 클릭 시 confirm 표시 함수
 * 주요 기능 : 초기화 실행 전 confirm을 거침
 */
function confirmInit() {
    if (confirm('내용을 초기화하시겠습니까?')) {
        initReg();
        alert('내용이 초기화되었습니다.');
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 초기화 - 물품 편집 페이지에서 입력한 내용을 초기화하는 함수
 * 주요 기능 : 초기화 버튼 클릭 및 confirm 확인 시 기존의 물품 상세 정보로 입력값 초기화
 */
function initReg() {
    document.getElementById('secondCategory').disabled = false;
    const firstOptions = document.getElementById('firstCategory').children;

    /** 초기화 시 대분류 selected 옵션을 결정하는 반복문 */
    for (var i = 1; i < firstOptions.length; i++) {
        if (firstOptions[i].value == firstCategory) {
            document.getElementById('firstCategory').children[i].selected = true;
            /** 해당 대분류의 하위 소분류 조회 */
            init_findSecondCategory(firstCategory);
            document.getElementById('secondCategory').value = '';
            break;
        }
    }
    /** input 초기화 */
    document.getElementById('product_name').value = productName;
    document.getElementById('quantity').value = quantity;

    /** 대여 가능 여부 라디오버튼 초기화 */
    if (rentalAvailability) {
        document.getElementsByName('rental_availability')[0].checked = true;
    } else {
        document.getElementsByName('rental_availability')[1].checked = true;
    }
    /** 반환 필요 여부 라디오버튼 초기화 */
    if (returnNeeded) {
        document.getElementsByName('return_needed')[0].checked = true;
    } else {
        document.getElementsByName('return_needed')[1].checked = true;
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 소분류 조회 - 초기화 시 해당 물품의 소분류 option들을 조회하는 함수
 * 주요 기능 : 대분류를 parameter로 해당 대분류의 하위 소분류 목록을 조회하여 Select 요소에 배치하는 기능
 */
function init_findSecondCategory(firstCategory) {
    /** 소분류 비활성화 해제 및 선택된 대분류를 변수로 저장 */
    document.getElementById('secondCategory').disabled = false;
    let selectedElement = document.getElementById("firstCategory");
    let optionVal = selectedElement.options[selectedElement.selectedIndex].value;
    
    /** 선택된 대분류를 parameter로 소분류 조회 api 호출 */
    let url = '/regProduct/findSecondCategory/' + optionVal;
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        /** 조회된 소분류 데이터 바인딩 */
        let str = '<option id="second_category_default" value="" disabled>선택</option>';
        for (var i = 0; i < data[0].secondCategory.length; i++) {
            str += '<option id="" value="' + data[0].secondCategory[i] + '">' + data[0].secondCategory[i] + '</option>';
        }
        document.getElementById('secondCategory').innerHTML = str;

        const secondOptions = document.getElementById('secondCategory').children;

        /** 소분류 selected를 결정하는 반복문 */
        for (var j = 1; j < secondOptions.length; j++) {
            if (secondOptions[j].value == secondCategory) {
                document.getElementById('secondCategory').children[j].selected = true;
                break;
            }
        }
    });
}
