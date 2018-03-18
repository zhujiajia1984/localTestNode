/**
 * Created by zjj on 2018/3/18
 * 页面：https://test.weiquaninfo.cn/mongo
 * 连接数据库：https://test.weiquaninfo.cn/mongo/connect
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;

// home page
router.get('/', function(req, res, next) {
    logger.info("welcome use mongo");
    res.send('welcome use mongo');
});

////////////////////////////////////////////////////
// 获取config所需的签名等信息
router.get('/connect', function(req, res, next) {
    res.send('connect to mongo');
});


//
module.exports = router;