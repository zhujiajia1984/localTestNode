// 
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

// 客户管理
module.exports = class Polygon {
    constructor(url) {
        this.url = url;
    }

    // 新增客户
    async addPolygon(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let curDate = new Date();
        for (let i = 0; i < data.length; i++) {
            data[i].createTime = curDate;
        }
        let result = await db.collection('polygon').insertMany(data);
        assert.equal(data.length, result.insertedCount);
        client.close();
        return result.ops;
    }

    // 查询客户
    async findPolygon() {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('polygon').find({}, {
            projection: { "lat": 1, "lng": 1, "_id": 0 }
        }).toArray();
        return result;
    }

    // 删除客户
    async delPolygon() {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('polygon').deleteMany({});
        client.close();
        return result;
    }
}