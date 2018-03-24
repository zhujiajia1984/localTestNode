// 
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

// 客户管理
module.exports = class Client {
    constructor(url) {
        this.url = url;
    }

    // // 新增客户
    // async addClient(data) {
    //     const client = await MongoClient.connect(this.url);
    //     const db = client.db("test");
    //     let curDate = new Date();
    //     let result = await db.collection('client').insertOne({
    //         name: typeof(data.name) == "undefined" ? '' : data.name,
    //         shortName: typeof(data.shortName) == "undefined" ? '' : data.shortName,
    //         createTime: curDate,
    //         lastModified: curDate,
    //     });
    //     assert.equal(1, result.insertedCount);
    //     client.close();
    //     return result.ops[0];
    // }

    // 查询客户
    async findAccount(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let clientId = typeof(data.clientId) == "undefined" ? "undefined" : data.clientId;
        let current = typeof(data.current) == "undefined" ? 1 : parseInt(data.current);
        let pageSize = typeof(data.pageSize) == "undefined" ? 20 : parseInt(data.pageSize);
        let sortField = typeof(data.sortby) == "undefined" ? '_id' : data.sortby;
        let sortOrder = typeof(data.order) == "undefined" ? -1 : parseInt(data.order);
        let query = (clientId == "undefined") ? {} : { clientId: ObjectID(clientId) };
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

    // // 更新客户信息
    // async updateClient(data) {
    //     const client = await MongoClient.connect(this.url);
    //     const db = client.db("test");
    //     let result = await db.collection('client').updateOne({ _id: new ObjectID(data.id) }, {
    //         $set: {
    //             name: data.name,
    //             shortName: typeof(data.shortName) == "undefined" ? '' : data.shortName,
    //             lastModified: new Date(),
    //         }
    //     });
    //     assert.equal(1, result.matchedCount);
    //     assert.equal(1, result.modifiedCount);
    //     // assert.equal(1, result.lastErrorObject.n);
    //     // assert.equal(true, result.lastErrorObject.updatedExisting);
    //     client.close();
    //     return result;
    // }



    // // 删除客户
    // async delClient(id) {
    //     const client = await MongoClient.connect(this.url);
    //     const db = client.db("test");
    //     let result = await db.collection('client').deleteOne({ _id: new ObjectID(id) });
    //     assert.equal(1, result.deletedCount);
    //     client.close();
    //     return result;
    // }
}