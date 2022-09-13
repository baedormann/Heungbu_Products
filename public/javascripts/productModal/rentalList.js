// 대여명단 모달창 띄우기
function rental() {
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('modal-productDetail');
    modalContent.classList.remove('modal-historyList');
    modalContent.classList.add('modal-rentalList');

    const modalTitle = document.getElementsByClassName('modal-title')[0];
    modalTitle.innerHTML = '물품 대여 명단';

    const modalBody = document.getElementsByClassName('modal-body')[0];
    let str = '';


    modalBody.innerHTML = '';
    /*
    const url = '/productManage/rentalList'
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
                "<tr>"
                + `<td>${res.product_category.firstCategory} - ${res.product_category.secondCategory}</td>`
                + `<td>${res.product_name}</td>`
                + `<td>${res.product_code}</td>`
                + `<td>${res.rental_availability ? 'O' : 'X'} </td>`
                + `<td>${res.return_needed ? 'O' : 'X'} </td>`
                + `<td>남은 수량</td>`
                + `<td>대여 수량</td>`
                + `<td>${res.quantity}</td>`
                + `<td>${res.last_date}</td>`
                + "</tr>"
            )
        });
        tableData.innerHTML = innerTable.join("");
        text.value = '';
    });*/
}