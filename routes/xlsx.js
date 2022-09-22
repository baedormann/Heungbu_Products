const express = require('express');
const router = express.Router();
const xlsx = require("xlsx");

/**
 * 담당자 : 박신욱
 * 함수 설명 : 엑셀 내보내기 API
 * 주요 기능 : req로 받아온 데이터를 통해 jsonSheet를 생성후 response
 */
router.post('/', async function (req, res, next) {
    try {
        let excelTabe = [];
        /** 양식에 맞는 헤더로 json 데이터 가공 */
        req.body.tableData.map((data) => {
            excelTabe.push({
                "대분류": data.first_category,
                "소분류": data.second_category,
                "제품 이름": data.product_name,
                "제품 코드": data.product_code,
                "대여 가능 여부": data.rental_availability,
                "반환 필요 여부": data.return_needed,
                "수량": data.quantity
            })
        });
        /** jsonSheet생성후 셀의 너비 설정 */
        let excelData = xlsx.utils.json_to_sheet(excelTabe);
        excelData['!cols'] = [
            {'width':10},
            {'width':10},
            {'width':20},
            {'width':20},
            {'width':15},
            {'width':15},
            {'width':10}
        ]
        res.status(200).send({excelData: excelData});
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports = router;
