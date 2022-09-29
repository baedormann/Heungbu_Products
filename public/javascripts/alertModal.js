/**
 * 담당자 : 배도훈
 * 함수 설명 : alert 모달을 표출하는 함수
 * 주요 기능 : alert 기능을 모달창으로 대체하여 표출
 */
function alert(text, reload){
    let alertModal = document.getElementById('alertModal');
    alertModal.style.display = 'block';

    if(reload){
        document.getElementsByClassName('alertBtnDiv')[0].innerHTML = '<button id="okBtn" onclick="alertDone(true)">확인</button>';
    }
    document.getElementsByClassName('alertText')[0].innerText = text;
    document.getElementById('okBtn').focus();
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 모달창 확인 함수
 * 주요 기능 : alert 확인 버튼 클릭 시 모달창을 닫는 함수
 */
function alertDone(reload){
    document.getElementById('alertModal').style.display = 'none';
    reload ? location.reload() : true;
}
