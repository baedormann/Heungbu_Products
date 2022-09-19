//엑셀 등록 모달 실행
function excelModal() {
    document.getElementById('excelModal').style.display = 'block';
}

//엑셀 등록 버튼 클릭 시
function readExcel() {
    let input = document.getElementById('excelBtn');
    let fileVal = input.value;
    let fileLength = fileVal.length;
    let fileType = fileVal.substring(fileVal.lastIndexOf('.') + 1, fileLength).toLowerCase();

    //파일이 없거나 엑셀파일이 아닌 경우
    if (!input.files[0] || (fileType != 'xls' && fileType != 'xlsx')) {
        alert('엑셀 파일을 선택해주세요.');
        return;
    }

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
                    throw alert('not 201');
                }
            }).then((data) => {
                console.log(data.data);
                let wrongCode = data.data[0];
                let wrongCategory1 = data.data[1];
                let wrongCategory2 = data.data[2];
                let wrongProduct = {
                    wrongCode: [],
                    wrongCategory1: [],
                    wrongCategory2: []
                };
                for (let i = 0; i < wrongCode.length; i++) {
                    wrongProduct.wrongCode.push(wrongCode[i].product_code + ' ');
                }
                ;
                for (let i = 0; i < wrongCategory1.length; i++) {
                    wrongProduct.wrongCategory1.push(wrongCategory1[i].product_code + ' ');
                }
                ;
                for (let i = 0; i < wrongCategory2.length; i++) {
                    wrongProduct.wrongCategory2.push(wrongCategory2[i].product_code + ' ');
                }
                ;

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
                if (confirm_ < rows.length && confirm_ == 0) {
                    alert("엑셀 파일 등록 성공")
                    return location.reload()
                } else if (rows.length == confirm_) {
                    alert("엑셀 파일 등록 실패\n\n오류:" + str);
                    return location.reload()
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

//모달 닫기 버튼 클릭 시
function excelDone() {
    document.getElementById('excelModal').style.display = 'none';
}
