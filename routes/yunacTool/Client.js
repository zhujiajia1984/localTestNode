// 
const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// 客户管理
module.exports = class Client {
    constructor(url) {
        this.url = url;
    }

    // 新增客户
    async addClient(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let curDate = new Date();
        let result = await db.collection('client').insertOne({
            name: typeof(data.name) == "undefined" ? '' : data.name,
            shortName: typeof(data.shortName) == "undefined" ? '' : data.shortName,
            createTime: curDate,
            lastModified: curDate,
        });
        assert.equal(1, result.insertedCount);
        client.close();
        return result.ops[0];
    }

    // 查询客户
    async findClient(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result;
        if (typeof(data.name) != "undefined") {
            // 根据name查询
            result = await db.collection('client').find({ name: data.name }).toArray();
        } else if (typeof(data.search) == "undefined") {
            // 查询所有（无name字段并且没有search字段）
            result = await db.collection('client').find({}).sort("lastModified", -1).toArray();
        }
        client.close();
        return result;
    }
}