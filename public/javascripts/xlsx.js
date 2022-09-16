// 엑셀내보내기
function xlsxTable() {
    let table = document.getElementById('productTable').getElementsByTagName('tr');
    let tableData = [];
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
            let sheet = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(sheet, data.excelData, 'test');
            XLSX.writeFile(sheet, '물품엑셀.xlsx');
        })

}