/**
 * Created by zjj on 2018/3/28
 * 测试生成token：get	https://test.weiquaninfo.cn/yunacApi/userAuth/signToken
 * 验证token接口：https://test.weiquaninfo.cn/yunacApi/userAuth
 */
var express = require('express');
var router = express.Router();
var logger = require('../../logs/log4js').logger;
var jwt = require('jsonwebtoken');

// const 
const secret = "201701200315zxtZJJgm135152";

/////////////////////////////////////////////////////////////
// 测试生成jwt token
router.get('/signToken', function(req, res, next) {
    // 签名
    jwt.sign({ foo: 'bar' }, secret, {
        issuer: 'zjj',
        subject: 'yunac',
        // expiresIn: 60,
    }, (err, token) => {
        if (err) {
            logger.error(err);
            res.send("error");
        }
        res.send(token);
    });

});

/////////////////////////////////////////////////////////////
// 验证token
let requireAuthentication = (req, res, next) => {
    let token = req.get("Authorization");
    console.log('token：', token);
    jwt.verify(token, secret, {
        issuer: 'zjj',
        subject: 'yunac',
    }, (err, decoded) => {
        if (err) {
            logger.error(err);
            res.status(401).send(err.name);
        }
        logger.info(decoded);
        res.status(200).end();
        // next();
    });

};
router.all('*', requireAuthentication);



//
module.exports = router;