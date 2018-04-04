/**
 * Created by zjj on 2018/4/1
 * 新增marker：post    https://test.weiquaninfo.cn/mongo/markers
 * 查询marker：get     https://test.weiquaninfo.cn/mongo/markers
 * 删除marker：delete  https://test.weiquaninfo.cn/mongo/markers?id=XXX
 * 修改marker：put     https://test.weiquaninfo.cn/mongo/markers?id=XXX
 * 上传marker缩略图：post https://test.weiquaninfo.cn/mongo/markers/upload
 * 上传marker语音：  post https://test.weiquaninfo.cn/mongo/markers/uploadAudio
 */
var express = require('express');
var router = express.Router();
var logger = require('../../../logs/log4js').logger;
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/cloudac/uploads/')
    },
    filename: function(req, file, cb) {
        let extName = ''; //后缀名
        switch (file.mimetype) {
            case 'image/jpg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
        }
        cb(null, `${file.fieldname}-${Date.now()}.${extName}`);
    }
})
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype != "image/jpg" &&
            file.mimetype != "image/jpeg" &&
            file.mimetype != "image/png"
        ) {
            cb(new Error('only support jpg/jpeg/png/mp3 file!'));
        } else {
            cb(null, true);
        }
    }
});
var storageAudio = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/cloudac/uploads/audio')
    },
    filename: function(req, file, cb) {
        let extName = ''; //后缀名
        switch (file.mimetype) {
            case 'audio/mp3':
                extName = 'mp3';
                break;
        }
        cb(null, `${file.fieldname}-${Date.now()}.${extName}`);
    }
});
var uploadAudio = multer({
    storage: storageAudio,
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
        if (file.mimetype != "audio/mp3") {
            cb(new Error('only support mp3 file!'));
        } else {
            cb(null, true);
        }
    }
});

// class
const Marker = require('../yunacTool/Marker.js');

//
const url = 'mongodb://mongodb_mongodb_1:27017';
// const url = 'mongodb://localhost:27017';

////////////////////////////////////////////////////
// 上传marker缩略图测试
router.post('/upload', upload.single('avatar'), function(req, res, next) {
    // console.log(req.file);
    res.status(200).send(req.file.path.slice(6)); /*去除public*/
})

////////////////////////////////////////////////////
// 上传marker语音
router.post('/uploadAudio', uploadAudio.single('audio'), function(req, res, next) {
    // console.log(req.file);
    res.status(200).send(req.file.path.slice(6)); /*去除public*/
})

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
    let id = null;
    if (typeof(req.query.id) != "undefined") {
        id = req.query.id;
    }
    //
    let marker = new Marker(url);
    marker.findMarker(id).then(result => {
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