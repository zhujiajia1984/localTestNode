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
        let r;
        let total;
        if (typeof(data.name) != "undefined") {
            // 根据name查询
            r = await db.collection('client').find({ name: data.name }).toArray();
        } else if (typeof(data.search) != "undefined") {
            // 模糊查询（无name字段但是有search字段）
            r = await db.collection('client').find({}).sort("lastModified", -1).toArray();
        } else {
            // 查询所有
            total = await db.collection('client').count();
            let cursor;
            let endValue;
            let startValue;
            for (let i = 0; i < parseInt(data.current); i++) {
                if (i == 0) {
                    cursor = await db.collection('client').find({})
                        .sort("lastModified", -1)
                        .limit(parseInt(data.pageSize));
                } else {
                    let a = 1;
                }
                await cursor.next();
                await cursor.next();
                // r = await cursor.next();
                await cursor.rewind();
                r = await cursor.toArray();
                // endValue = await cursor.next();
                // r = await cursor.toArray();
                // startValue = await cursor.next();
                // console.log(endValue);
            }
        }
        client.close();
        let result = {};
        result.data = r;
        result.total = total;
        return result;
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