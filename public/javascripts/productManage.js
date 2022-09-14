let first = '';
let second = '';

// 권한에 따른 UI
let selectSearch = document.getElementById('select_search');
let newOption = document.createElement('option');
if (JSON.parse(localStorage.getItem('manage'))) {
    newOption.setAttribute('value', 'product_rent');
    newOption.innerText = "대여자";
    selectSearch.appendChild(newOption);
}
if (!(JSON.parse(localStorage.getItem('open_auth')) || JSON.parse(localStorage.getItem('manage')))){
    document.getElementById("xlsxBtn").style.display="none"
}

// 엑셀내보내기
function xlsxTable() {
    let wb = XLSX.utils.table_to_book(document.getElementById('productTable'), {sheet: "xlsxSheet", raw: true});
    XLSX.writeFile(wb, ('물품테이블.xlsx'));
}

// 물품 검색
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
        data.data.map(res => {
            innerTable.push(
                `<tr onclick=productModalOpen('${res.product_code}')>`
                + `<td>${res.product_category.firstCategory} - ${res.product_category.secondCategory}</td>`
                + `<td>${res.product_name}</td>`
                + `<td>${res.product_code}</td>`
                + `<td>${res.rental_availability ? 'O' : 'X'} </td>`
                + `<td>${res.return_needed ? 'O' : 'X'} </td>`
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

// 필터 컨트롤
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

function secondFilter(e) {
    second = e.value;
    productSearch()
}

// 소분류 가져오기
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
        secondSelect.innerHTML = '';
        let second = ["<option value=''>전체</option>"]
        data[0].secondCategory.map(res => {
            second.push(`<option value='${res}'>${res}</option>`);
        })
        secondSelect.innerHTML = second.join("")
    });
}

// 필터 검색
function productFilter() {
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
        body: JSON.stringify({"condition": selectSearch.value, "text": text.value})
    }).then(response => response.json()).then((data) => {
        let innerTable = [];
        data.data.map(res => {
            innerTable.push(
                `<tr onclick=productModalOpen('${res.product_code}')>`
                + `<td>${res.product_category.firstCategory} - ${res.product_category.secondCategory}</td>`
                + `<td>${res.product_name}</td>`
                + `<td>${res.product_code}</td>`
                + `<td>${res.rental_availability ? 'O' : 'X'} </td>`
                + `<td>${res.return_needed ? 'O' : 'X'} </td>`
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

// 정렬
function sortTable(n, e) {
    var table, rows, switching, o, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("productTable");
    switching = true;
    dir = e.firstElementChild.getAttribute('value');
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("tr");

        for (o = 1; o < (rows.length - 1); o++) {
            shouldSwitch = false;
            x = rows[o].getElementsByTagName("td")[n];
            y = rows[o + 1].getElementsByTagName("td")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    e.innerHTML = `${e.innerText}<i class=\"fa-solid fa-sort-down\" value="desc"></i>`
                    break;
                }
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

function productDone() {
    var modal = document.getElementById('productModal');
    modal.style.display = "none";
}

window.onclick = function (event) {
    var modal = document.getElementById('productModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



