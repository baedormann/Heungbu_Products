// 물품등록 api
function editProduct() {
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
    editProductApi()
}

// 대여 라디오 값 반환
function rental_availability() {
    const rental_availability_arr = document.getElementsByName('rental_availability');
    let rental_availability = '';
    rental_availability_arr.forEach((node) => {
        if (node.checked) {
            return rental_availability = node.value;
        }
    })
}

// 반환 라디오 값 반환
function return_needed() {
    //반환 필요 여부return_needed 값 설정
    const return_needed_arr = document.getElementsByName('return_needed');
    let return_needed = '';
    return_needed_arr.forEach((node) => {
        if(node.checked)  {
            return return_needed = node.value;
        }
    })
}

// 편집 api호출
function editProductApi() {
    let url = "/editProduct"
    let product = {
        firstCategory : document.getElementById("firstCategory").value,
        secondCategory : document.getElementById("secondCategory").value,
        product_code : document.getElementById("product_code").value,
        product_name : document.getElementById("product_name").value,
        quantity : document.getElementById("quantity").value,
        rental_availability : rental_availability(),
        return_needed : return_needed()
    };
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
    }).then(response => {
        const { status } = response;
        if(status == 400) {
            alert("중복된 물품코드입니다.")
        }else{
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
function initReg(){
    if (confirm('내용을 초기화하시겠습니까?')){
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

//카테고리 추가 모달창 켜기
function addCategoryModal() {
    let modal = document.getElementById('addCategoryModal');
    modal.style.display = "block";
};

//모달 닫기 버튼 클릭 시
function addDone() {
    let modal = document.getElementById('addCategoryModal');
    modal.style.display = "none";
}

//모달 바깥 부분 클릭 시
window.onclick = function (event) {
    let modal = document.getElementById('addCategoryModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//대분류 선택 시 소분류 조회
function findSecondCategory(firstCategory) {
    document.getElementById('secondCategory').disabled = false;
    let selectedElement = document.getElementById("firstCategory");
    let optionVal = selectedElement.options[selectedElement.selectedIndex].value

    let url = '/regProduct/findSecondCategory/' + optionVal;
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        }
    }).then(response => response.json()).then((data) => {
        let str = '<option id="second_category_default" value="" disabled>선택</option>';
        for (var i = 0; i < data[0].secondCategory.length; i++){
            str += '<option id="" value="' + data[0].secondCategory[i] + '">' + data[0].secondCategory[i] + '</option>';
        }
        document.getElementById('secondCategory').innerHTML = str;
    });
}

//카테고리 추가 시 라디오버튼 동작
var radio = document.getElementsByName('selectNth');
for(var i = 0; i < radio.length; i++){
    radio[i].addEventListener('click', async function (){
        let addCategoryInput = document.getElementById('addCategoryInput');
        let firstCategoryArr;//api요청

        //대분류 추가 라디오 버튼 클릭 시
        if(this.value == 'addFirstCategory'){
            addCategoryInput.lastElementChild.remove();
            addCategoryInput.firstElementChild.innerHTML = '대분류 <input type="text" id="addFirstInput">';
        }
        //소분류 추가 라디오 버튼 클릭 시
        if(this.value == 'addSecondCategory' && addCategoryInput.childElementCount == 1){
            let optionStr = '<option id="first_category_default" value="" disabled selected>선택</option>';
            const url = '/regProduct/findFirstCategory/';
            await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie('token')
                }
            }).then(response => response.json()).then((data) => {
                for (var i = 0; i < data.length; i++){
                    optionStr += '<option value="' + data[i].firstCategory + '">' + data[i].firstCategory + '</option>'
                }
            });
            addCategoryInput.firstElementChild.innerHTML = '대분류 ' + '<select id="addFirstSelect">' + optionStr + '</select>';
            let newSpan = document.createElement('span');
            newSpan.innerHTML = '<span>소분류 <input id="addSecondInput" type="text"></span>';
            addCategoryInput.appendChild(newSpan);
        }
    })
}

function regCategory(){
    let nth = document.getElementsByName('selectNth');
    let url = '/regProduct/regCategory';
    let first;
    if(nth[0].checked){
        first = document.getElementById('addFirstInput').value;


    }else if(nth[1].checked){
        first = document.getElementById('addFirstSelect').value;
    }
    let category = {
        firstCategory : first,
        secondCategory: document.getElementById('addSecondInput') ? document.getElementById('addSecondInput').value : null
    }
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
        alert('카테고리 등록에 실패했습니다.');
    })
}





