/**
 * Created by zjj on 2018/3/1
 * 页面：http://test.weiquaninfo.cn/wxWebMobileTest
 * 获取config所需的签名接口：http://test.weiquaninfo.cn/wxWebMobileTest/getConfigSign
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;
var childProc = require('child_process');
var moment = require('moment');
var redisClient = require('../redis');
var crypto = require('crypto');

// page
router.get('/', function(req, res, next) {
	// let host = req.getHeader('Host');
	res.render('wxWebMobileTest');
});

////////////////////////////////////////////////////
// 获取config所需的签名等信息
router.get('/getConfigSign', function(req, res, next) {
	let signData = {};
	signData.timestamp = moment().unix();
	signData.url = 'http://test.weiquaninfo.cn/wxWebMobileTest/';
	getSignData(signData).then((result) => {
		signData.noncestr = result.noncestr;
		signData.jsapi_ticket = result.jsapi_ticket;
		logger.info(signData);
		let string1 = `jsapi_ticket=${signData.jsapi_ticket}&noncestr=${signData.noncestr}&timestamp=${signData.timestamp}&url=${signData.url}`;
		let hash = crypto.createHash('sha1');
		hash.update(string1);
		let signature = hash.digest('hex');
		signData.signature = signature;
		res.json(signData);
	}).catch((error) => {
		logger.error(error);
		res.end("error");
	})
	// getRandomData().then((noncestr) => {
	// 	signData.noncestr = noncestr;
	// 	return getJsapiTicket();
	// }).then((jsapi_ticket) => {
	// 	// 拼接
	// 	let string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${signData.noncestr}&timestamp=${signData.timestamp}&url=${signData.url}`;
	// 	// sha1加密
	// 	let hash = crypto.createHash('sha1');
	// 	hash.update(string1);
	// 	let signature = hash.digest('hex');
	// 	signData.signature = signature;

	// 	// 返回
	// 	res.json(signData);
	// }).catch((error) => {
	// 	logger.error(error);
	// 	res.end('error');
	// })
});

////////////////////////////////////////////////////
// 获取所有签名所需要的数据
async function getSignData(signData) {
	const noncestr = await getRandomData();
	const jsapi_ticket = await getJsapiTicket();
	return { noncestr: noncestr, jsapi_ticket: jsapi_ticket };
}

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

////////////////////////////////////////////////////
// 获取jsapi_ticket
function getJsapiTicket() {
	return new Promise((resolve, reject) => {
		redisClient.get('jsapi_ticket', (error, resData) => {
			if (error) {
				logger.error(error);
				return reject(error);
			} else {
				return resolve(JSON.parse(resData));
			}
		});
	})
}

//
module.exports = router;