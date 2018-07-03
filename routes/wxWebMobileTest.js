/**
 * Created by zjj on 2018/3/1
 * 页面：https://test.weiquaninfo.cn/wxWebMobileTest
 * 获取config所需的签名接口：https://test.weiquaninfo.cn/wxWebMobileTest/getConfigSign
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

////////////////////////////////////////////////////////////////////////////////////////////////////
// 获取config所需的签名等信息
router.get('/getConfigSign', function(req, res, next) {
    let signData = {};
    signData.timestamp = moment().unix();
    signData.url = 'https://test.weiquaninfo.cn/wxWebMobileTest/';
    getSignData(signData).then((result) => {
        signData.noncestr = result.noncestr;
        signData.jsapi_ticket = result.jsapi_ticket;
        // logger.info(signData);
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
    //  signData.noncestr = noncestr;
    //  return getJsapiTicket();
    // }).then((jsapi_ticket) => {
    //  // 拼接
    //  let string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${signData.noncestr}&timestamp=${signData.timestamp}&url=${signData.url}`;
    //  // sha1加密
    //  let hash = crypto.createHash('sha1');
    //  hash.update(string1);
    //  let signature = hash.digest('hex');
    //  signData.signature = signature;

    //  // 返回
    //  res.json(signData);
    // }).catch((error) => {
    //  logger.error(error);
    //  res.end('error');
    // })
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// 获取微信卡券的signature
router.get('/getCardSign', function(req, res, next) {
    let data = req.query;
    if (typeof(data.cardId) == "undefined") {
        logger.error("need cardId");
        res.status(406).json({ msg: "cardId missing!" });
    } else {
        getWxCardSign(data.cardId).then(result => {
            // logger.info("result: ", result);
            let cardExt = {
                "timestamp": result.timestamp,
                "signature": result.signature,
                "nonce_str": result.noncestr,
            };
            res.status(200).json({
                cardId: data.cardId,
                cardExt: JSON.stringify(cardExt),
            })
        })
    }
})

///////////////////////////////////////////////////
// 获取微信卡券签名
async function getWxCardSign(cardId) {
    const api_ticket = await getApiTicket();
    const noncestr = await getRandomData();
    const card_sign_data = await getCardSign(api_ticket, noncestr, cardId);
    return card_sign_data;
}

////////////////////////////////////////////////////
// 获取微信卡券签名
function getCardSign(api_ticket, noncestr, cardId) {
    return new Promise((resolve, reject) => {
        let signData = {};
        signData.timestamp = moment().unix();
        signData.noncestr = noncestr;
        signData.cardId = cardId;
        signData.apiTicket = api_ticket;
        let string1 = [signData.timestamp, signData.noncestr, signData.cardId, signData.apiTicket].sort().join("");
        let hash = crypto.createHash('sha1');
        hash.update(string1);
        let signature = hash.digest('hex');
        signData.signature = signature;
        // signData.string1 = string1;
        return resolve(signData);
    })
}

////////////////////////////////////////////////////
// 获取微信卡券api_ticket
function getApiTicket() {
    return new Promise((resolve, reject) => {
        redisClient.get('api_ticket', (error, resData) => {
            if (error) {
                logger.error(error);
                return reject(error);
            } else {
                return resolve(JSON.parse(resData));
            }
        });
    })
}

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