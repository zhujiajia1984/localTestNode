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
        } else {
            // 分页、排序和模糊查询
            let current = typeof(data.current) == "undefined" ? 1 : parseInt(data.current);
            let pageSize = typeof(data.pageSize) == "undefined" ? 20 : parseInt(data.pageSize);
            let sortField = typeof(data.sortby) == "undefined" ? 'lastModified' : data.sortby;
            let sortOrder = typeof(data.order) == "undefined" ? -1 : parseInt(data.order);
            let query = (typeof(data.search) == "undefined" || data.search == "undefined") ? {} : { $or: [{ name: { $regex: `${data.search}`, $options: 'i' } }, { shortName: { $regex: `${data.search}`, $options: 'i' } }] };
            let total = await db.collection('client').find(query).count();
            let r = await db.collection('client').find(query)
                .skip((current - 1) * pageSize)
                .sort(sortField, sortOrder)
                .limit(pageSize)
                .toArray();
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
        let result = await db.collection('client').updateOne({ _id: new ObjectID(data.id) }, {
            $set: {
                name: data.name,
                shortName: typeof(data.shortName) == "undefined" ? '' : data.shortName,
                lastModified: new Date(),
            }
        });
        assert.equal(1, result.matchedCount);
        assert.equal(1, result.modifiedCount);
        // assert.equal(1, result.lastErrorObject.n);
        // assert.equal(true, result.lastErrorObject.updatedExisting);
        client.close();
        return result;
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