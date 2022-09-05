const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const product = require('../models/product');

/* GET productManage page. */
router.get('/', authUtil, async function(req, res, next) {
    const data = await product.find().exec();
    res.render('productManage', { stateUrl: 'productManage', data: data });
});

module.exports = router;
