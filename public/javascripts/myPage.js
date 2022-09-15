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