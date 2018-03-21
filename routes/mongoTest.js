/**
 * Created by zjj on 2018/3/18
 * 新增客户：post    https://test.weiquaninfo.cn/mongo/clients
 * 查询客户：get     https://test.weiquaninfo.cn/mongo/clients?name=xxx
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
// 查询客户
router.get('/clients', function(req, res, next) {
    let data = req.query;
    //
    let client = new Client(url);
    client.findClient(data).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        logger.error(error);
        res.status(406).json(error);
    })
});

////////////////////////////////////////////////////
// 新增客户
router.post('/clients', function(req, res, next) {
    let data = req.body;
    //
    let client = new Client(url);
    client.addClient(data).then(result => {
        res.status(201).json(result);
    }).catch(error => {
        logger.error(error);
        res.status(406).json(error);
    })
});

//
module.exports = router;