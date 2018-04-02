/**
 * Created by zjj on 2018/4/1
 * 新增marker：post    https://test.weiquaninfo.cn/mongo/markers
 * 查询marker：get     https://test.weiquaninfo.cn/mongo/polygons
 * 删除marker：delete  https://test.weiquaninfo.cn/mongo/polygons?id=XXX
 * 修改marker：put     https://test.weiquaninfo.cn/mongo/polygons?id=XXX
 */
var express = require('express');
var router = express.Router();
var logger = require('../../../logs/log4js').logger;

// class
const Marker = require('../yunacTool/Marker.js');

//
const url = 'mongodb://mongodb_mongodb_1:27017';
// const url = 'mongodb://localhost:27017';

////////////////////////////////////////////////////
// 新增marker
router.post('/', function(req, res, next) {
    if (typeof(req.body.name) == "undefined") {
        logger.error("create marker need name");
        res.status(406).json({ msg: "id missing!" });
        return;
    } else if (typeof(req.body.type) == "undefined") {
        logger.error("create marker need type");
        res.status(406).json({ msg: "type missing!" });
        return;
    } else if (typeof(req.body.lng) == "undefined") {
        logger.error("create marker need lng");
        res.status(406).json({ msg: "lng missing!" });
        return;
    } else if (typeof(req.body.lat) == "undefined") {
        logger.error("create marker need lat");
        res.status(406).json({ msg: "lat missing!" });
        return;
    } else if (typeof(req.body.thumb) == "undefined") {
        logger.error("create marker need thumb");
        res.status(406).json({ msg: "thumb missing!" });
        return;
    } else {
        let data = req.body;
        //
        let marker = new Marker(url);
        marker.addMarker(data).then(result => {
            res.status(201).json(result);
        }).catch(error => {
            logger.error(error);
            res.status(406).json(error);
        })
    }
});

////////////////////////////////////////////////////
// 查询marker
router.get('/', function(req, res, next) {
    //
    let marker = new Marker(url);
    marker.findMarker().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        logger.error(error);
        res.status(406).json(error);
    })
});

////////////////////////////////////////////////////
// 删除marker
router.delete('/', function(req, res, next) {
    if (typeof(req.query.id) == "undefined") {
        logger.error("delete marker need id");
        res.status(406).json({ msg: "id missing!" });
        return;
    } else {
        //
        let marker = new Marker(url);
        marker.delMarker(req.query.id).then(result => {
            res.status(204).json({});
        }).catch(error => {
            logger.error(error);
            res.status(406).json(error);
        })
    }
});

////////////////////////////////////////////////////
// 更新marker
router.put('/', function(req, res, next) {
    if (typeof(req.query.id) == "undefined") {
        logger.error("update client need id");
        res.status(406).json({ msg: "id missing!" });
        return;
    } else if (typeof(req.body.name) == "undefined") {
        logger.error("update marker need name");
        res.status(406).json({ msg: "name missing!" });
        return;
    } else if (typeof(req.body.type) == "undefined") {
        logger.error("update marker need type");
        res.status(406).json({ msg: "type missing!" });
        return;
    } else if (typeof(req.body.lng) == "undefined") {
        logger.error("update marker need lng");
        res.status(406).json({ msg: "lng missing!" });
        return;
    } else if (typeof(req.body.lat) == "undefined") {
        logger.error("update marker need lat");
        res.status(406).json({ msg: "lat missing!" });
        return;
    } else if (typeof(req.body.thumb) == "undefined") {
        logger.error("update marker need thumb");
        res.status(406).json({ msg: "thumb missing!" });
        return;
    } else {
        //
        let data = req.body;
        data.id = req.query.id;
        let marker = new Marker(url);
        marker.updateMarker(data).then(result => {
            res.status(201).json(result);
        }).catch(error => {
            logger.error(error);
            res.status(406).json(error);
        })
    }
});


//
module.exports = router;