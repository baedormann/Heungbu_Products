function alert(text){
    let alertModal = document.getElementById('alertModal');
    alertModal.style.display = 'block';
    document.getElementsByClassName('alertText')[0].innerHTML = text;
}
function alertDone(){
    document.getElementById('alertModal').style.display = 'none';
    return true;
}
