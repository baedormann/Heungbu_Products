let first = '';
let second = '';

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품 관리에 권한에 따른 UI표시
 * 주요 기능 : localStorage에 저장된 관리자 권한, 열람권한 검증 후 대여자 검색기능 및 엑셀 내보내기 기능 활성화
 */
let selectSearch = document.getElementById('select_search');
let newOption = document.createElement('option');
if (JSON.parse(localStorage.getItem('manage'))) {
    newOption.setAttribute('value', 'product_rent');
    newOption.innerText = "대여자";
    selectSearch.appendChild(newOption);
}
if (!(JSON.parse(localStorage.getItem('open_auth')) || JSON.parse(localStorage.getItem('manage')))) {
    document.getElementById("xlsxBtn").style.display = "none"
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 필터와 조건에 맞는 물품 검색 API 요청
 * 주요 기능 : 대분류, 소분류, 조건, 텍스트데이터를 가져와 검색 API요청 후 response되는 데이터들 가공
 */
function productSearch() {
    let selectSearch = document.getElementById("select_search");
    let text = document.getElementById("input_text");
    let tableData = document.getElementById("table_data");
    const url = '/productManage/search';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({
            "condition": selectSearch.value,
            "text": text.value,
            "firstCategory": first,
            "secondCategory": second
        })
    }).then(response => response.json()).then((data) => {
        let innerTable = [];
        /** 검색된 데이터로 테이블 재가공 */
        data.data.map(res => {
            innerTable.push(
                `<tr onclick=productModalOpen('${res.product_code}')>`
                + `<td>${res.product_category.firstCategory} - ${res.product_category.secondCategory}</td>`
                + `<td>${res.product_name}</td>`
                + `<td>${res.product_code}</td>`
                + `<td>${res.rental_availability ? 'O' : 'X'}</td>`
                + `<td>${res.return_needed ? 'O' : 'X'}</td>`
                + `<td>${res.leftQuantity}</td>`
                + `<td>${res.rentalQuantity}</td>`
                + `<td>${res.quantity}</td>`
                + `<td>${res.last_date.split('T')[0]}</td>`
                + "</tr>"
            )
        });
        tableData.innerHTML = innerTable.join("");
        text.value = '';
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 검색 필터 컨트롤 함수
 * 주요 기능 : 선택된 대분류를 매게변수로 가져와 소분류 요청 함수 실행 및 검색함수 실행
 */
function firstFilter(e) {
    first = e.value;
    second = '';
    let secondSelect = document.querySelector(".secondFilter");
    if (e.value) {
        secondSelect.disabled = false;
        secondCategorys(e.value);
    } else {
        secondSelect.disabled = true;
        secondSelect.innerHTML = "<option value=''>전체</option>"
    }
    productSearch()
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 선택된 소분류를 매게변수로 가져와 검색함수 실행
 * 주요 기능 : 검색함수 재요청으로 통해 동적인 화면 연출
 */
function secondFilter(e) {
    second = e.value;
    productSearch()
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대분류에 따른 소분류데이터를 요청하는 API
 * 주요 기능 : 대분류를 매게변수로 가져와 소분류 select태그 옵션 변경
 */
function secondCategorys(firstCategory) {
    let secondSelect = document.querySelector(".secondFilter");
    const url = '/category/' + firstCategory;
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        /** 소분류 select 태그 설정 */
        secondSelect.innerHTML = '';
        let second = ["<option value=''>전체</option>"]
        data[0].secondCategory.map(res => {
            second.push(`<option value='${res}'>${res}</option>`);
        })
        secondSelect.innerHTML = second.join("")
    });
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 테이블 asc, desc 정렬 기능
 * 주요 기능 : 테이블을 가져와 각행을 돌면서 정렬 및 asc, desc 아이콘 변경
 */
function sortTable(n, e) {
    var table, rows, switching, o, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("productTable");
    switching = true;
    /** asc, desc 아이콘 변경을위한 선택된 값 */
    dir = e.firstElementChild.getAttribute('value');
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("tr");
        
        for (o = 1; o < (rows.length - 1); o++) {
            shouldSwitch = false;
            x = rows[o].getElementsByTagName("td")[n];
            y = rows[o + 1].getElementsByTagName("td")[n];

            /** 오름차순 정렬 */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    e.innerHTML = `${e.innerText}<i class=\"fa-solid fa-sort-down\" value="desc"></i>`
                    break;
                }
                /** 내림차순 정렬 */
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    e.innerHTML = `${e.innerText}<i class=\"fa-solid fa-sort-up\" value="asc"></i>`
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[o].parentNode.insertBefore(rows[o + 1], rows[o]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품상세 모달창 닫기 기능
 * 주요 기능 : 모달창의 스타일을 none으로 설정
 */
function productDone() {
    var modal = document.getElementById('productModal');
    modal.style.display = "none";
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 물품 상세 모달창 닫기 기능
 * 주요 기능 : 모달창외 화면클릭시 모달창 스타일 none으로 설정
 */
window.onclick = function (event) {
    var modal = document.getElementById('productModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



