// 
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
        if (typeof(data.name) != "undefined") {
            // 根据name查询
            let r = await db.collection('client').find({ name: data.name }).toArray();
            client.close();
            return r;
        } else if (typeof(data.search) != "undefined") {
            // 模糊查询（无name字段但是有search字段）
            let r = await db.collection('client').find({}).sort("lastModified", -1).toArray();
            client.close();
            return r;
        } else if (typeof(data.current) == "undefined" || typeof(data.pageSize) == "undefined") {
            // 不带参数查询所有，默认20条分页，默认按照末次更新时间倒序
            let total = await db.collection('client').count();
            let r = await db.collection('client').find({})
                .sort("lastModified", -1)
                .limit(20)
                .toArray();
            client.close();
            let result = {};
            result.data = r;
            result.total = total;
            result.current = 1;
            result.pageSize = 20;
            return result;
        } else {
            // 分页查询
            let total = await db.collection('client').count();
            let current = parseInt(data.current);
            let pageSize = parseInt(data.pageSize);
            let lastValue;
            let cursor = await db.collection('client').find({})
                .sort("lastModified", -1)
                .limit(pageSize);
            if (current > 1) {
                for (let i = 1; i < current; i++) {
                    // 游标移动到底
                    while (await cursor.hasNext()) {
                        let tmp = await cursor.next();
                        lastValue = tmp.lastModified;
                    }
                    // 获取下一页数据
                    cursor = await db.collection('client').find({
                            lastModified: { $lt: new Date(lastValue) }
                        })
                        .sort("lastModified", -1)
                        .limit(pageSize);
                }
            }
            let r = await cursor.toArray();

            // output
            client.close();
            let result = {};
            result.data = r;
            result.total = total;
            return result;
        }
    }

    // 更新客户信息
    async updateClient(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('client').findOneAndUpdate({ _id: new ObjectID(data.id) }, {
            $set: {
                name: data.name,
                shortName: typeof(data.shortName) == "undefined" ? '' : data.shortName,
                lastModified: new Date(),
            }
        }, {
            returnOriginal: false,
        });
        // assert.equal(1, result.matchedCount);
        // assert.equal(1, result.modifiedCount);
        assert.equal(1, result.lastErrorObject.n);
        assert.equal(true, result.lastErrorObject.updatedExisting);
        client.close();
        return result.value;
    }



    // 删除客户
    async delClient(id) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('client').deleteOne({ _id: new ObjectID(id) });
        assert.equal(1, result.deletedCount);
        client.close();
        return result;
    }
}