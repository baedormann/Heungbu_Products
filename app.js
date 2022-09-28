const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/**
 * 담당자 : 공동
 * 함수 설명 : Controller 구성
 */
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const memberApi = require('./routes/member');
const authRouter = require('./routes/auth');
const emailRouter = require('./routes/emailAuth');
const regProduct = require('./routes/regProduct');
const editProduct = require('./routes/editProduct');
const useManageRouter = require('./routes/manageUser');
const productManageRouter = require('./routes/productManage');
const categoryApi = require('./routes/category');
const rentalApi = require('./routes/rental');
const rentalCheck = require('./routes/rentalCheck');
const myPage = require('./routes/myPage');
const xlsxApi = require('./routes/xlsx');

/**
 * 담당자 : 박신욱
 * 함수 설명 : MiddleWare 구성
 */
const authUtil = require('./middlewares/auth').checkToken;
const manage = require('./middlewares/manage').checkToken;
const editAuth = require('./middlewares/regProduct').checkToken;
const openAuth = require('./middlewares/open').checkToken;
const rentAuth = require('./middlewares/rent').checkToken;

const app = express();

/**
 * 담당자 : 박신욱
 * 함수 설명 : 뷰엔진 셋업
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 담당자 : 박신욱
 * 함수 설명 : 몽고 db의 admin 계정 정보 외부 url 주소
 */
const id = "admin";
const pwd = "heven";
const url = `mongodb://${id}:${pwd}@13.125.245.95:27017/admin`

/**
 * 담당자 : 박신욱
 * 함수 설명 : 흥부데이터베이스로 연동
 */
mongoose
    .connect(url,
        { dbName: 'Heunbu' },
        { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));

/**
 * 담당자 : 공동
 * 함수 설명 : API connect
 * 주요 기능 : 각각의 API마다 middleWare 주입
 */

/** 내부 middleWare */
app.use('/',indexRouter);
app.use('/auth', authRouter);
app.use('/emailAuth', emailRouter);
app.use('/login', loginRouter);
app.use('/productManage', productManageRouter);

app.use('/member', authUtil, memberApi);
app.use('/manageUser', manage, useManageRouter);
app.use('/regProduct', editAuth, regProduct);
app.use('/editProduct', editAuth, editProduct);
app.use('/category', authUtil, categoryApi);
app.use('/rental', rentAuth, rentalApi);
app.use('/rentStatus', openAuth, rentalCheck);
app.use('/myPage', authUtil, myPage);
app.use('/xlsx', openAuth, xlsxApi);

/**
 * 담당자 : 박신욱
 * 함수 설명 : 404에러 핸들러
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 에러 헨들러
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
