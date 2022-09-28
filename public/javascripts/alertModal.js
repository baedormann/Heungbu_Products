function alert(text, reload){
    let alertModal = document.getElementById('alertModal');
    alertModal.style.display = 'block';

    if(reload){
        document.getElementsByClassName('alertBtnDiv')[0].innerHTML = '<button id="okBtn" onclick="alertDone(true)">확인</button>';
    }
    document.getElementsByClassName('alertText')[0].innerText = text;
}
function alertDone(reload){
    document.getElementById('alertModal').style.display = 'none';
    reload ? location.reload() : true;
}
