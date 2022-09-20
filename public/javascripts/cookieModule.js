// 쿠키 데이터 가져오기
function getCookie(cName) {
    cName = cName + '=';
    let cookieData = document.cookie;
    let start = cookieData.indexOf(cName);
    let cValue = '';
    if (start != -1) {
        start += cName.length;
        let end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    //console.log(cValue);
    return cValue;
}

// 쿠키 저장
function setCookie(key, value, day) {
    let toDay = new Date();
    toDay.setDate(toDay.getDate() + day);
    document.cookie = key + "=" + escape(value) + "; path=/; expries=" + toDay.toUTCString() + ";"
}

// 쿠키 삭제
function deleteCookie(key) {
    document.cookie = setCookie(key, '', 0);
}