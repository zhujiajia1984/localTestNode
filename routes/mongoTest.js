/**
 * Created by zjj on 2018/3/18
 * 页面：https://test.weiquaninfo.cn/mongo
 * 连接数据库：https://test.weiquaninfo.cn/mongo/connect
 */
var express = require('express');
var router = express.Router();
var logger = require('../logs/log4js').logger;
var assert = require('assert');

//
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongodb_mongodb_1:27017';

// home page
router.get('/', function(req, res, next) {
    logger.info("welcome use mongo");
    res.send('welcome use mongo');
});

////////////////////////////////////////////////////
// 连接数据库
router.get('/connect', function(req, res, next) {
    insertDocs().then(client => {
        const db = client.db('test');
        client.close();
        logger.info("Connected successfully to server");
    }).catch(error => {
        logger.error(error);
    })
    // MongoClient.connect(url, (err, client) => {
    //     assert.equal(null, err);
    //     logger.info("Connected successfully to server");

    //     //
    //     const db = client.db('test');
    //     const collection = db.collection('users');
    //     collection.insertMany([
    //         { a: 1 }, { a: 2 }, { a: 3 }
    //     ], (err, result) => {
    //         assert.equal(err, null);
    //         assert.equal(3, result.result.n);
    //         assert.equal(3, result.ops.length);
    //         logger.info("Inserted 3 documents into the collection");

    //         //
    //         client.close();
    //         //
    //         res.send('connect to mongo ok and close !');
    //     });
    // });
});

////////////////////////////////////////////////////
// async函数1
async function insertDocs() {
    return await MongoClient.connect(url);
}


//
module.exports = router;