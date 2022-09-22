/**
 * 담당자 : 박신욱
 * 함수 설명 : 마이페이지 에서의 물품 반환 기능
 * 주요 기능 : 해당 물품의 _id 값을 가져와 물품반납 API요청
 */
function returnProduct(id, name) {
    if(!confirm(`${name} 물품을 반납 하시겠습니까??`))
        return
    const url = '/myPage/return';
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('token')
        },
        body: JSON.stringify({_id: id})
    }).then(response => response.json()).then((data) => {
        alert('반납이 완료 되었습니다..');
        location.reload();
    });
}