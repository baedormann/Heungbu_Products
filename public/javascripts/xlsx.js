/**
 * 담당자 : 박신욱
 * 함수 설명 : 테이블 데이터를 가공하여 엑셀시트 API 요청
 * 주요 기능 : 권한에 따라 메인페이지에서 사용될 물품, 대여, 사용자 데이터들을 response
 */
function xlsxTable() {
    let table = document.getElementById('productTable').getElementsByTagName('tr');
    let tableData = [];
    
    /** 데이터를 엑셀 양식에 맞게 데이터 가공 */
    for (let i = 1; i < table.length; i++) {
        let cells = table[i].getElementsByTagName('td');
        tableData.push({
            first_category: cells[0].innerHTML.split('-')[0],
            second_category: cells[0].innerHTML.split('-')[1],
            product_name: cells[1].innerHTML,
            product_code: cells[2].innerHTML,
            rental_availability: cells[3].innerHTML == 'O' ? "true" : "false",
            return_needed: cells[4].innerHTML == 'O' ? "true" : "false",
            quantity: cells[7].innerHTML,
        });
    }

    /** 엑셀 내보내기 API */
    const url = '/xlsx';
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({tableData: tableData})
    })
        .then(response => response.json())
        .then(data => {
            /** 엑셀 다운로드 */
            let sheet = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(sheet, data.excelData, 'test');
            XLSX.writeFile(sheet, '물품엑셀.xlsx');
        })
}