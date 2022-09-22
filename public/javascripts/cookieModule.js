/**
 * 담당자 : 박신욱
 * 함수 설명 : 등록된 쿠키 데이터 가져오기
 * 주요 기능 : 받아온 쿠키데이터를 매게변수에 맞는 쿠키데이터를 값만 가져올수 있도록 데이터 가공
 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 쿠키저장 함수
 * 주요 기능 : 쿠키형식에 맞게 key, value, day값을 받아와 쿠키저장
 */
function setCookie(key, value, day) {
    let toDay = new Date();
    toDay.setDate(toDay.getDate() + day);
    document.cookie = key + "=" + escape(value) + "; path=/; expries=" + toDay.toUTCString() + ";"
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 쿠키삭제
 * 주요 기능 : 쿠키데이터를 비움으로써 데이터 삭제
 */
function deleteCookie(key) {
    document.cookie = setCookie(key, '', 0);
}