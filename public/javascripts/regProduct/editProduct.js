//페이지 로드 시 실행되는 코드
const firstCategory = document.getElementById('firstCategoryHidden').value;
const secondCategory = document.getElementById('secondCategoryHidden').value;
const productName = document.getElementById('product_name').value;
const quantity = document.getElementById('quantity').value;
let rentalAvailability;
let returnNeeded;

if (document.getElementById('rentalAvailailityHidden').value == 'true') {
    rentalAvailability = true;
} else {
    rentalAvailability = false;
}

if (document.getElementById('returnNeededHidden').value == 'true') {
    returnNeeded = true;
} else {
    returnNeeded = false;
}

initReg();

// 물품등록 api
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
    editProductApi()
}

// 편집 api호출
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
        const {status} = response;
        if (status == 400) {
            alert("중복된 물품코드입니다.")
        } else {
            return response.json()
        }
    }).then((data) => {
        alert(data.message);
        console.log(data);
        location.reload();
    }).catch((err) => {
        console.log(err);
        alert("물품등록에 실패했습니다.");
    });
}

//초기화 컨펌
function confirmInit() {
    if (confirm('내용을 초기화하시겠습니까?')) {
        initReg();
        alert('내용이 초기화되었습니다.');
    }
}

//내용 초기화
function initReg() {
    document.getElementById('secondCategory').disabled = false;
    const firstOptions = document.getElementById('firstCategory').children;

    //대분류 selected 결정 반복문
    for (var i = 1; i < firstOptions.length; i++) {
        if (firstOptions[i].value == firstCategory) {
            document.getElementById('firstCategory').children[i].selected = true;
            //초기화 시 소분류 조회
            init_findSecondCategory(firstCategory);
            document.getElementById('secondCategory').value = '';
            break;
        }
    }
    //input 초기화
    document.getElementById('product_name').value = productName;
    document.getElementById('quantity').value = quantity;

    //라디오버튼 초기화
    if (rentalAvailability) {
        document.getElementsByName('rental_availability')[0].checked = true;
    } else {
        document.getElementsByName('rental_availability')[1].checked = true;
    }

    if (returnNeeded) {
        document.getElementsByName('return_needed')[0].checked = true;
    } else {
        document.getElementsByName('return_needed')[1].checked = true;
    }
}

//초기화 시 소분류 조회
function init_findSecondCategory(firstCategory) {
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

        const secondOptions = document.getElementById('secondCategory').children;

        //소분류 selected 결정 반복문
        for (var j = 1; j < secondOptions.length; j++) {
            if (secondOptions[j].value == secondCategory) {
                document.getElementById('secondCategory').children[j].selected = true;
                break;
            }
        }
    });
}
