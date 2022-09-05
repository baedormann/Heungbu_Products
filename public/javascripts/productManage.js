
function xlsxTable() {
    var wb = XLSX.utils.table_to_book(document.getElementById('productTable'), {sheet:"xlsxSheet",raw:true});
    XLSX.writeFile(wb, ('물품테이블.xlsx'));
}