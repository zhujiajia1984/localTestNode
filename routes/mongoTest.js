/**
 * Created by zjj on 2018/3/18
 * 页面：https://test.weiquaninfo.cn/mongo
 * 连接数据库：https://test.weiquaninfo.cn/mongo/connect
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;
var assert = require('assert');

// class
const Client = require('./yunacTool/Client');

//
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongodb_mongodb_1:27017';
// const url = 'mongodb://localhost:27017';

// home page
router.get('/', function(req, res, next) {
    // logger.info(new Point(11, 22).toString());
    res.send('welcome use mongo');
});

////////////////////////////////////////////////////
// 新增客户
router.get('/addClient', function(req, res, next) {
    let client = new Client(url);
    client.addClient("234").then(client => {
        client.close();
        logger.info("add client success");
        res.send("success");
    }).catch(error => {
        logger.error(error);
        res.send(error);
    })
});

//
module.exports = router;