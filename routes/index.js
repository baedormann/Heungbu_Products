const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;

/* GET home page. */
router.get('/', authUtil,function(req, res, next) {
  res.render('index', { stateUrl: 'home' });
});


module.exports = router;
