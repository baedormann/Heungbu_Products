const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const memberRouter = require('./routes/member');
const authRouter = require('./routes/auth');
const regProduct = require('./routes/regProduct');
const useManageRouter = require('./routes/manageUser');
const productManageRouter = require('./routes/productManage');
const categoryApi = require('./routes/category');

const test = require('./routes/xlsx');

// midleware
const authUtil = require('./middlewares/auth').checkToken;
const manage = require('./middlewares/manage').checkToken;
const editAuth = require('./middlewares/regProduct').checkToken;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const id = "admin";
const pwd = "heven";
const url = `mongodb://${id}:${pwd}@13.125.245.95:27017/admin`

// 몽고db 연동
mongoose
    .connect(url,
        { dbName: 'Heunbu' },
        { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));

app.use('/',indexRouter);
app.use('/login', loginRouter);
app.use('/member', authUtil, memberRouter);
app.use('/auth', authRouter);
app.use('/manageUser', manage, useManageRouter);
app.use('/regProduct', editAuth, regProduct);
app.use('/productManage', productManageRouter);
app.use('/category', categoryApi);
app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
