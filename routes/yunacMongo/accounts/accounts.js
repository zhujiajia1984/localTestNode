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
// 查询客户
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

// ////////////////////////////////////////////////////
// // 新增客户
// router.post('/', function(req, res, next) {
//     let data = req.body;
//     //
//     let client = new Client(url);
//     client.addClient(data).then(result => {
//         res.status(201).json(result);
//     }).catch(error => {
//         logger.error(error);
//         res.status(406).json(error);
//     })
// });

// ////////////////////////////////////////////////////
// // 更新客户
// router.put('/', function(req, res, next) {
//     if (typeof(req.query.id) == "undefined") {
//         logger.error("update client need id");
//         res.status(406).json({ msg: "id missing!" });
//     } else if (typeof(req.body.name) == "undefined") {
//         logger.error("update client need name");
//         res.status(406).json({ msg: "name missing!" });
//     } else {
//         //
//         let data = req.body;
//         data.id = req.query.id;
//         let client = new Client(url);
//         client.updateClient(data).then(result => {
//             res.status(201).json(result);
//         }).catch(error => {
//             logger.error(error);
//             res.status(406).json(error);
//         })
//     }
// });

// ////////////////////////////////////////////////////
// // 删除客户
// router.delete('/', function(req, res, next) {
//     if (typeof(req.query.id) == "undefined") {
//         logger.error("delete client need id");
//         res.status(406).json({ msg: "id missing!" });
//     } else {
//         //
//         let id = req.query.id;
//         let client = new Client(url);
//         client.delClient(id).then(result => {
//             res.status(204).json({});
//         }).catch(error => {
//             logger.error(error);
//             res.status(406).json(error);
//         })
//     }
// });


//
module.exports = router;