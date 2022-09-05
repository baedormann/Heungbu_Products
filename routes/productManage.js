const express = require('express');
const router = express.Router();
const product = require('../models/product');
const categorys = require('../models/category');
/* GET productManage page. */
router.get('/', async function(req, res, next) {
    const data = await product.find().exec();
    const category = await categorys.find().exec();
    res.render('productManage', { stateUrl: 'productManage', data: data, category: category });
});

module.exports = router;
