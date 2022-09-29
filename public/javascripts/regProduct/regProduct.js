/**
 * 담당자 : 배도훈
 * 함수 설명 : 물품 등록 api 호출 - 물품 등록 api를 호출하는 함수
 * 주요 기능 : 물품 등록 버튼 클릭 시 입력된 데이터를 등록하는 api를 호출함
 */
function regProductApi() {
    let url = "/regProduct"
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
        method: "post", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify(product)
    }).then(response => {
        return response.json()
    }).then(data => {
        alert(data.message);
    })
        .catch(e => alert("물품등록에 실패했습니다."));
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 초기화. 물품 등록 페이지에서 입력한 내용을 초기화하는 함수
 * 주요 기능 : 초기화 버튼 클릭 및 confirm 확인 시 입력값 초기화
 */
function initReg() {
    if (confirm('내용을 초기화하시겠습니까?')) {
        document.getElementById('first_category_default').selected = true;
        document.getElementById('second_category_default').selected = true;
        document.getElementById('product_code').value = '';
        document.getElementById('product_name').value = '';
        document.getElementById('quantity').value = '';
        document.getElementsByName('rental_availability')[0].checked = true;
        document.getElementsByName('return_needed')[0].checked = true;

        alert('초기화되었습니다.');
    }
}





