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
	// let host = req.getHeader('Host');
	logger.info("hostname：", req.hostname);
	res.end('wxWebMobileTest');
});

////////////////////////////////////////////////////
// 获取config所需的签名等信息
router.get('/getConfigSign', function(req, res, next) {
	getRandomData().then((stdout) => {
		logger.info(stdout);
	})
	res.end('getConfigSign');
});



////////////////////////////////////////////////////
// 获取随机值
function getRandomData() {
	return new Promise((resolve, reject) => {
		let cmd = 'head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 16';
		childProc.exec(cmd, (err, stdout, stderr) => {
			if (stderr) {
				return reject(err);
			} else {
				return resolve(stdout);
			}
		})
	})
}

//
module.exports = router;