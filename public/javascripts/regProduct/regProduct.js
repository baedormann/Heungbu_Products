// 등록 api호출
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
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
    }).then(response => {
        const {status} = response;
        if (status == 400) {
            alert("중복된 물품코드입니다.")
        } else {
            return response.json()
        }
    }).then((data) => {
        alert(data.message);
        console.log(data);
    }).catch((err) => {
        console.log(err);
        alert("물품등록에 실패했습니다.");
    });
}

//내용 초기화
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





