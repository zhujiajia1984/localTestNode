// 
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
// const Long = require('mongodb').Long;
var assert = require('assert');

// 客户管理
module.exports = class Client {
    constructor(url) {
        this.url = url;
    }

    // // 新增客户
    async addAccount(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('account').insertOne({
            accountName: data.accountName,
            userName: typeof(data.userName) == "undefined" ? '' : data.userName,
            createTime: new Date(),
            clientId: ObjectID(data.clientId),
        });
        assert.equal(1, result.insertedCount);
        client.close();
        return result.ops[0];
    }

    // 查询客户
    async findAccount(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let clientId = typeof(data.clientId) == "undefined" ? "undefined" : data.clientId;
        let current = typeof(data.current) == "undefined" ? 1 : parseInt(data.current);
        let pageSize = typeof(data.pageSize) == "undefined" ? 20 : parseInt(data.pageSize);
        let sortField = typeof(data.sortby) == "undefined" ? '_id' : data.sortby;
        let sortOrder = typeof(data.order) == "undefined" ? -1 : parseInt(data.order);
        let query;
        if (typeof(data.search) == "undefined" || data.search == "undefined") {
            query = (clientId == "undefined") ? {} : { clientId: ObjectID(clientId) };
        } else {
            query = (clientId == "undefined") ? {} : { clientId: ObjectID(clientId), $or: [{ accountName: { $regex: `${data.search}`, $options: 'i' } }, { userName: { $regex: `${data.search}`, $options: 'i' } }] };
        }
        let total = await db.collection('account').find(query).count();
        let r = await db.collection('account').find(query)
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

    // 更新客户信息
    async updateAccount(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('account').updateOne({ _id: new ObjectID(data.id) }, {
            $set: {
                accountName: data.accountName,
                userName: typeof(data.userName) == "undefined" ? '' : data.userName,
            }
        });
        assert.equal(1, result.matchedCount);
        assert.equal(1, result.modifiedCount);
        client.close();
        return result;
    }

    // 删除账号
    async delAccount(id) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('account').deleteOne({ _id: new ObjectID(id) });
        assert.equal(1, result.deletedCount);
        client.close();
        return result;
    }
}