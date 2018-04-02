var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var logger = require('./logs/log4js').logger;
var cors = require('cors');

//
var index = require('./routes/index');
var wxWebMobileTest = require('./routes/wxWebMobileTest');
var yunac = require('./routes/yunac');
var mapHeat = require('./routes/mapHeat');
var yunacMongoClients = require('./routes/yunacMongo/clients/clients');
var yunacMongoAccounts = require('./routes/yunacMongo/accounts/accounts');
var yunacApiUserAuth = require('./routes/yunacApi/userAuth');
var yunacMongoPolygons = require('./routes/yunacMongo/polygons/polygons');
var yunacMongoMarkers = require('./routes/yunacMongo/markers/marker');
//
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 
app.use(cors());
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(log4js.connectLogger(logger, { level: 'auto' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    dotfiles: 'allow'
}));

// 页面路由
app.use(['/', '/index', '/apManage', '/groupManage', '/apUser', '/testYunAc', '/getwxinfo',
    '/pwdReset', '/peizhi', '/apType', '/tzManage', '/tzType', '/apUser',
    '/version', '/versionType', '/profile', '/editPwd', '/logSystem',
    '/logOperation', '/subClient', '/subRole', '/subAccount', '/account',
    '/hometongji', '/msgCenter', '/apMonitor', './editWxLogin', '/apConfig',
    '/ssidEdit', '/devmap'
], yunac);
app.use('/wxWebMobileTest', wxWebMobileTest);
app.use('/mapHeat', mapHeat);
app.use('/mongo/clients', yunacMongoClients);
app.use('/mongo/accounts', yunacMongoAccounts);
app.use('/mongo/polygons', yunacMongoPolygons);
app.use('/mongo/markers', yunacMongoMarkers);
app.use('/yunacApi/userAuth', yunacApiUserAuth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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