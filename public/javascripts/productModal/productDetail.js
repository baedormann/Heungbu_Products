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
        console.log(data);
        document.getElementById("product_name").innerHTML = `물품 이름 : ${data.product_name}`
        document.getElementById("product_category").innerHTML = `대분류 : ${data.product_category.firstCategory} 소분류 : ${data.product_category.secondCategory}`
        document.getElementById("product_code").innerHTML = `물품코드 : ${data.product_code}`
        document.getElementById("rental_availability").innerHTML = `대여 여부 : ${data.rental_availability}`
        document.getElementById("return_needed").innerHTML = `반납 여부 : ${data.return_needed}`
        document.getElementById("quantity").innerHTML = `물품 수량 : ${data.quantity}`
    });
}
