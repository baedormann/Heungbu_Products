/**
 * 담당자 : 배도훈
 * 함수 설명 : 라디오버튼 클릭이벤트 - 대분류 추가 화면 또는 소분류 추가 화면 나타내는 함수
 * 주요 기능 : 카테고리 추가 모달에서 라디오버튼이 클릭되었을 때 동적으로 화면을 표시하는 기능
 * 대분류 데이터 API 요청
 */
var radio = document.getElementsByName('selectNth');
for (var i = 0; i < radio.length; i++) {
    radio[i].addEventListener('click', async function () {
        let addCategoryInput = document.getElementById('addCategoryInput');
        let firstCategoryArr;//api요청

        /** 소분류 추가 화면에서 대분류 추가 라디오 버튼을 클릭할 경우 */
        if (this.value == 'addFirstCategory' && addCategoryInput.childElementCount == 2) {
            addCategoryInput.lastElementChild.remove();
            addCategoryInput.firstElementChild.innerHTML = '대분류 <input type="text" id="addFirstInput">';
        }

        /** 대분류 추가 화면에서 소분류 추가 라디오 버튼을 클릭할 경우*/
        if (this.value == 'addSecondCategory' && addCategoryInput.childElementCount == 1) {
            /** 새로 등록할 소분류의 대분류를 지정하기 위한 옵션 생성 */
            let optionStr = '<option id="first_category_default" value="" disabled selected>선택</option>';
            
            /** 대분류 조회 */
            const url = '/regProduct/findFirstCategory/';
            await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie('token')
                }
            }).then(response => response.json()).then((data) => {
                /** 조회된 데이터를 대분류 옵션에 바인딩 */
                for (var i = 0; i < data.length; i++) {
                    optionStr += '<option value="' + data[i].firstCategory + '">' + data[i].firstCategory + '</option>'
                }
            });
            
            /** 데이터 바인딩한 대분류 옵션과 소분류 추가 인풋박스를 화면에 추가 */
            addCategoryInput.firstElementChild.innerHTML = '대분류 ' + '<select id="addFirstSelect">' + optionStr + '</select>';
            let newSpan = document.createElement('span');
            newSpan.innerHTML = '<span>소분류 <input id="addSecondInput" type="text"></span>';
            addCategoryInput.appendChild(newSpan);
        }
    })
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 카테고리 추가 모달창을 나타내는 함수
 * 주요 기능 : 모달창의 display 속성을 none에서 block으로 변경하여 화면에 나타냄
 */
function addCategoryModal() {
    let modal = document.getElementById('addCategoryModal');
    modal.style.display = "block";
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 카테고리 추가 모달창을 숨기는 함수
 * 주요 기능 : 닫기 버튼 클릭 시 페이지 새로고침을 통해 초기 설정값 적용하여 모달창을 숨김
 */
function addDone() {
    let modal = document.getElementById('addCategoryModal');
    /*modal.style.display = "none";
    if (document.getElementById('addSecondRadio').checked == true) {
        document.getElementById('addSecondRadio').checked = false;
        document.getElementById('addFirstRadio').checked = true;
        if(document.getElementById('addSecondInput').parentElement){
            document.getElementById('addSecondInput').parentElement.parentElement.remove();
        }
        document.getElementById('addFirstSelect').parentElement.innerHTML = '대분류 <input type="text" id="addFirstInput">';
    }*/
    location.reload();
}


/**
 * 담당자 : 배도훈
 * 함수 설명 : 카테고리 추가 모달창을 숨기는 함수
 * 주요 기능 : 모달창 바깥 부분 클릭 시 페이지 새로고침을 통해 초기 설정값 적용하여 모달창을 숨김
 */
window.onclick = function (event) {
    let modal = document.getElementById('addCategoryModal');
    if (event.target == modal) {
        /*modal.style.display = "none";*/
        location.reload();
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 대분류 추가 시 유효성 검사
 * 주요 기능 : 대분류 추가 시 대분류를 입력하지 않으면 alert 표시
 */
function firstNullCheck() {
    if (document.getElementById('addFirstInput')) {
        if (document.getElementById('addFirstInput').value == '') {
            alert('대분류명을 입력해주세요.');
            return false;
        }
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 소분류 추가 시 유효성 검사
 * 주요 기능 : 소분류 추가 시 대분류 또는 소분류를 입력하지 않으면 alert 표시
 */
function secondNullCheck() {
    if (document.getElementById('addFirstSelect')) {
        if (document.getElementById('addFirstSelect').value == '') {
            alert('대분류명을 선택해주세요.');
            return false;
        } else if (document.getElementById('addSecondInput')) {
            if (!document.getElementById('addSecondInput').value) {
                alert('소분류명을 입력해주세요.');
                return false;
            }
        }
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 카테고리를 등록하는 함수
 * 주요 기능 : 카테고리 등록 모달창에서 등록 버튼 클릭 시 실행, 유효성 검사 함수 실행 후 유효할 시 등록
 */
function regCategory() {
    let nth = document.getElementsByName('selectNth');
    let url = '/regProduct/regCategory';
    let category;

    /** 대분류 추가 라디오버튼이 체크된 경우 */
    if (nth[0].checked) {
        /** 대분류 null 체크 */
        if (firstNullCheck() == false) {
            /** 유효하지 않을 시 함수 종료 */
            return;
        }
        /** 유효할 시 url과 category 할당 */
        url = '/regProduct/regFirstCategory';
        category = {
            firstCategory: document.getElementById('addFirstInput').value
        }
    }
    /** 대분류 추가 라디오버튼이 체크된 경우 */
    else {
        /** 대분류 select, 소분류 input null 체크 */
        if (secondNullCheck() == false) {
            /** 유효하지 않을 시 함수 종료 */
            return;
        }
        /** 유효할 시 url과 category 할당 */
        url = '/regProduct/regCategory';
        category = {
            firstCategory: document.getElementById('addFirstSelect').value,
            secondCategory: document.getElementById('addSecondInput') ? document.getElementById('addSecondInput').value : []
        }
    }
    /** 카테고리 등록 api 호출 */
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category)
    }).then(response =>
        response.json()
    ).then((data) => {
        alert(data.message);
    }).catch((err) => {
    })
}