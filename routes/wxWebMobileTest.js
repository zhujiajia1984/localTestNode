/**
 * Created by zjj on 2018/3/1
 * 页面：http://localhost:18159/wxWebMobileTest
 * 获取config所需的签名接口：http://localhost:18159/wxWebMobileTest/getConfigSign
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;
var childProc = require('child_process');
var moment = require('moment');

// page
router.get('/', function(req, res, next) {
	logger.info("wxWeb page");
	res.end('wxWebMobileTest');
});

////////////////////////////////////////////////////
// 获取config所需的签名等信息
router.get('/getConfigSign', function(req, res, next) {
	logger.error("wxWeb page2");
	res.end('wxWebMobileTest2');
});

//
module.exports = router;