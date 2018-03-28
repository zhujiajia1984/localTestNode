/**
 * Created by zjj on 2018/3/24
 * 新增账号：post    https://test.weiquaninfo.cn/mongo/accounts
 * 查询账号：get     https://test.weiquaninfo.cn/mongo/accounts?clientId=xxx
 * 删除账号：delete  https://test.weiquaninfo.cn/mongo/accounts?id=xxx
 * 更新账号：put     https://test.weiquaninfo.cn/mongo/accounts?id=xxx
 */
var express = require('express');
var router = express.Router();
var logger = require('../../../logs/log4js').logger;

// class
const Account = require('../yunacTool/Account');

//
const url = 'mongodb://mongodb_mongodb_1:27017';

////////////////////////////////////////////////////
// 查询账号
router.get('/', function(req, res, next) {
    let data = req.query;
    //
    let account = new Account(url);
    account.findAccount(data).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        logger.error(error);
        res.status(406).json(error);
    })
});

////////////////////////////////////////////////////
// 新增账号
router.post('/', function(req, res, next) {
    let data = req.body;
    if (typeof(data.clientId) == "undefined") {
        logger.error("add account need clientId");
        res.status(406).json({ msg: "clientId missing!" });
    } else if (typeof(data.accountName) == "undefined") {
        logger.error("add account need accountName");
        res.status(406).json({ msg: "accountName missing!" });
    } else {
        // add account
        let client = new Account(url);
        client.addAccount(data).then(result => {
            res.status(201).json(result);
        }).catch(error => {
            logger.error(error);
            res.status(406).json(error);
        })
    }

});

////////////////////////////////////////////////////
// 更新账号
router.put('/', function(req, res, next) {
    if (typeof(req.query.id) == "undefined") {
        logger.error("update account need id");
        res.status(406).json({ msg: "id missing!" });
    } else if (typeof(req.body.accountName) == "undefined") {
        logger.error("update account need name");
        res.status(406).json({ msg: "name missing!" });
    } else {
        //
        let data = req.body;
        data.id = req.query.id;
        let client = new Account(url);
        client.updateAccount(data).then(result => {
            res.status(201).json(result);
        }).catch(error => {
            logger.error(error);
            res.status(406).json(error);
        })
    }
});

////////////////////////////////////////////////////
// 删除账号
router.delete('/', function(req, res, next) {
    if (typeof(req.query.id) == "undefined") {
        logger.error("delete account need id");
        res.status(406).json({ msg: "id missing!" });
    } else {
        //
        let id = req.query.id;
        let client = new Account(url);
        client.delAccount(id).then(result => {
            res.status(204).json({});
        }).catch(error => {
            logger.error(error);
            res.status(406).json(error);
        })
    }
});


//
module.exports = router;