
//카테고리 추가 시 라디오버튼 동작
var radio = document.getElementsByName('selectNth');
for (var i = 0; i < radio.length; i++) {
    radio[i].addEventListener('click', async function () {
        let addCategoryInput = document.getElementById('addCategoryInput');
        let firstCategoryArr;//api요청

        //대분류 추가 라디오 버튼 클릭 시
        if (this.value == 'addFirstCategory' && addCategoryInput.childElementCount == 2) {
            addCategoryInput.lastElementChild.remove();
            addCategoryInput.firstElementChild.innerHTML = '대분류 <input type="text" id="addFirstInput">';
        }
        //소분류 추가 라디오 버튼 클릭 시
        if (this.value == 'addSecondCategory' && addCategoryInput.childElementCount == 1) {
            let optionStr = '<option id="first_category_default" value="" disabled selected>선택</option>';
            const url = '/regProduct/findFirstCategory/';
            await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie('token')
                }
            }).then(response => response.json()).then((data) => {
                for (var i = 0; i < data.length; i++) {
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

//카테고리 추가 모달창 켜기
function addCategoryModal() {
    let modal = document.getElementById('addCategoryModal');
    modal.style.display = "block";
}

//모달 닫기 버튼 클릭 시
function addDone() {
    let modal = document.getElementById('addCategoryModal');
    modal.style.display = "none";
    if (document.getElementById('addSecondRadio').checked == true) {
        document.getElementById('addSecondRadio').checked = false;
        document.getElementById('addFirstRadio').checked = true;
        if(document.getElementById('addSecondInput').parentElement){
            document.getElementById('addSecondInput').parentElement.parentElement.remove();
        }
        document.getElementById('addFirstSelect').parentElement.innerHTML = '대분류 <input type="text" id="addFirstInput">';
    }
    location.reload();
}


//모달 바깥 부분 클릭 시
window.onclick = function (event) {
    let modal = document.getElementById('addCategoryModal');
    let modal2 = document.getElementById('excelModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if(event.target == modal2) {
        modal2.style.display = "none";
    }
}


//대분류 추가 시 null값 검사
function firstNullCheck() {
    if (document.getElementById('addFirstInput')) {
        if (document.getElementById('addFirstInput').value == '') {
            alert('대분류명을 입력해주세요.');
            return false;
        }
    }
}

//소분류 추가 시 null값 검사
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

//카테고리 등록
function regCategory() {
    let nth = document.getElementsByName('selectNth');
    let url = '/regProduct/regCategory';
    let category;

    //대분류 추가 시
    if (nth[0].checked) {
        //대분류 null 체크
        if (firstNullCheck() == false) {
            return;
        }
        url = '/regProduct/regFirstCategory';
        category = {
            firstCategory: document.getElementById('addFirstInput').value
        }
        //소분류 추가 시
    } else {
        //대분류 select, 소분류 input null 체크
        if (secondNullCheck() == false) {
            return;
        }
        url = '/regProduct/regCategory';
        category = {
            firstCategory: document.getElementById('addFirstSelect').value,
            secondCategory: document.getElementById('addSecondInput') ? document.getElementById('addSecondInput').value : []
        }
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
    })
}