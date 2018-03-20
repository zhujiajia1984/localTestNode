/**
 * Created by zjj on 2018/3/20
 * 页面：https://test.weiquaninfo.cn/mapHeat
 */
var express = require('express');
var fs = require('fs');
var router = express.Router();
var logger = require('../logs/log4js').logger;
// var path = require("path");
var assert = require('assert');
var readline = require('readline');


// home page
router.get('/', function(req, res, next) {
    // logger.info(path.join(__dirname, 'map.txt'));
    let fRead = fs.createReadStream('/home/node/myapp/public/map.txt');
    let fWrite = fs.createWriteStream('/home/node/myapp/public/test.txt');
    const rl = readline.createInterface({
        input: fRead,
        output: fWrite
    });
    rl.on('line', (lineData) => {
        // logger.info(`Received: ${lineData}`);
        let arrTmp = lineData.split(",");
        fWrite.write(`{"lng":${arrTmp[0]}, "lat":${arrTmp[1]}, "count": ${parseInt(Math.random()*100)}},\r\n`);
    });
    res.end("end");
});

//
module.exports = router;