const express = require('express');
const router = express.Router();
const xlsx = require("xlsx");

router.post('/', async function (req, res, next) {
    try {
        let excelTabe = [];
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
