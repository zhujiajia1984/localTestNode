/**
 * Created by zjj on 2018/3/30
 * 新增多边形：post    https://test.weiquaninfo.cn/mongo/polygons
 * 查询多边形：get     https://test.weiquaninfo.cn/mongo/polygons
 * 删除多边形：delete  https://test.weiquaninfo.cn/mongo/polygons
 */
var express = require('express');
var router = express.Router();
var logger = require('../../../logs/log4js').logger;

// class
const Polygon = require('../yunacTool/Polygons.js');

//
const url = 'mongodb://mongodb_mongodb_1:27017';
// const url = 'mongodb://localhost:27017';

////////////////////////////////////////////////////
// 新增多边形
router.post('/', function(req, res, next) {
    let data = req.body;
    //
    let polygon = new Polygon(url);
    polygon.addPolygon(data).then(result => {
        res.status(201).json(result);
    }).catch(error => {
        logger.error(error);
        res.status(406).json(error);
    })
});

////////////////////////////////////////////////////
// 查询多边形
router.get('/', function(req, res, next) {
    //
    let polygon = new Polygon(url);
    polygon.findPolygon().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        logger.error(error);
        res.status(406).json(error);
    })
});

////////////////////////////////////////////////////
// 删除多边形
router.delete('/', function(req, res, next) {
    //
    let polygon = new Polygon(url);
    polygon.delPolygon().then(result => {
        res.status(204).json({});
    }).catch(error => {
        logger.error(error);
        res.status(406).json(error);
    })

});


//
module.exports = router;