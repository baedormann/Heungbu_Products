const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const member = require('../models/member')

/* GET manageUser page. */
router.get('/', async function(req, res, next) {
    const data = await member.find().exec();
    res.render('manageUser', { stateUrl: 'manageUser', data: data });
});

module.exports = router;
