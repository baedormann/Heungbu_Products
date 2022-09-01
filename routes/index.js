const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;

/* GET home page. */
router.get('/', authUtil,function(req, res, next) {
  res.render('index', { stateUrl: 'home' });
});

/* 물품 등록 페이지로 이동 */
router.get('/', authUtil,function(req, res, next) {
  res.render('regProduct', { stateUrl: 'regProduct' });
});

module.exports = router;
