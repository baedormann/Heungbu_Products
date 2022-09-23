/**
 * 담당자 : 배도훈
 * 함수 설명 : 모달 실행 - 엑셀 파일 업로드 모달을 나타내는 함수
 * 주요 기능 : 모달을 실행함
 */
function excelModal() {
    document.getElementById('excelModal').style.display = 'block';
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : Input File 태그 커스텀
 * 주요 기능 : Input File 태그 커스텀에 대한 input 태그 value 설정
 */
function inputFile(e) {
    document.getElementsByClassName("upload-name")[0].value = e.value
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 엑셀 파일 읽기 - 업로드한 엑셀 파일을 읽는 함수
 * 주요 기능 : 업로드한 엑셀 파일의 유효성 검사, 유효한 파일이면 등록 api 호출
 */
function readExcel() {
    let input = document.getElementById('excelBtn');
    let fileVal = input.value;
    let fileLength = fileVal.length;
    let fileType = fileVal.substring(fileVal.lastIndexOf('.') + 1, fileLength).toLowerCase();

    /** 파일이 없거나 엑셀 형식이 아닌 경우 */
    if (!input.files[0] || (fileType != 'xls' && fileType != 'xlsx')) {
        alert('엑셀 파일을 선택해주세요.');
        return;
    }

    /** sheet.js 코드 - 파일 읽고 업로드 api 호출 */
    let reader = new FileReader();
    reader.onload = function () {
        let data = reader.result;
        let workBook = XLSX.read(data, {type: 'binary'});
        workBook.SheetNames.forEach(function (sheetName) {
            let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            let url = '/regProduct/regExcel';
            fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rows)
            }).then(response => {
                const {status} = response;
                if (status == 201) {
                    return response.json();
                } else {
                    throw alert('올바른 형식이 아닙니다.');
                }
            }).then((data) => {
                console.log(data.data);
                /** 오류 발생 물품들을 사용자에게 alert으로 표시 */
                /** 오류 발생 물품들을 변수로 저장 */
                let wrongCode = data.data[0];
                let wrongCategory1 = data.data[1];
                let wrongCategory2 = data.data[2];
                let wrongProduct = {
                    wrongCode: [],
                    wrongCategory1: [],
                    wrongCategory2: []
                };
                /** 코드 중복 물품들  */
                for (let i = 0; i < wrongCode.length; i++) {
                    wrongProduct.wrongCode.push(wrongCode[i].product_code + ' ');
                }
                /** 대분류가 없는 물품들 */
                for (let i = 0; i < wrongCategory1.length; i++) {
                    wrongProduct.wrongCategory1.push(wrongCategory1[i].product_code + ' ');
                }
                /** 소분류가 없는 물품들 */
                for (let i = 0; i < wrongCategory2.length; i++) {
                    wrongProduct.wrongCategory2.push(wrongCategory2[i].product_code + ' ');
                }

                /** 사용자에게 표시할 메시지 설정 */
                let str = '';
                str += wrongProduct.wrongCode.length ? '\n코드 중복 : ' : '';
                for (let i = 0; i < wrongProduct.wrongCode.length; i++) {
                    str += wrongProduct.wrongCode[i] + ' ';
                }
                str += wrongProduct.wrongCategory1.length ? '\n대분류 없음 : ' : '';
                for (let i = 0; i < wrongProduct.wrongCategory1.length; i++) {
                    str += wrongProduct.wrongCategory1[i] + ' ';
                }
                str += wrongProduct.wrongCategory2.length ? '\n소분류 없음 : ' : '';
                for (let i = 0; i < wrongProduct.wrongCategory2.length; i++) {
                    str += wrongProduct.wrongCategory2[i] + ' ';
                }
                const confirm_ = data.data[0].length + data.data[1].length + data.data[2].length;
                /** 물품 등록이 전부 성공했을 경우 */
                if (confirm_ < rows.length && confirm_ == 0) {
                    alert("엑셀 파일 등록 성공")
                    return location.reload()
                /** 물품 등록이 전부 실패했을 경우 */
                } else if (rows.length == confirm_) {
                    alert("엑셀 파일 등록 실패\n\n오류:" + str);
                    return location.reload()
                /** 물품 등록이 하나라도 성공했을 경우 */
                } else {
                    alert("엑셀 파일 성공\n\n오류:" + str);
                    return location.reload()
                }
            }).catch((err) => {
                alert("엑셀파일 등록 실패");
            });
        })
    };
    reader.readAsBinaryString(input.files[0]);
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 모달 닫기 - 모달 닫기 버튼 클릭 시 실행되는 함수
 * 주요 기능 : 모달창의 display를 'none'으로 변경하여 숨김
 */
function excelDone() {
    document.getElementById('excelModal').style.display = 'none';
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 모달 닫기 - 모달 닫기 버튼 클릭 시 실행되는 함수
 * 주요 기능 : 모달창의 display를 'none'으로 변경하여 숨김
 */
/*window.onclick = function (event) {
    let modal = document.getElementById('excelModal');
    if (event.target == modal) {
        modal.style.display = "none";
        location.reload();
    }
}*/
