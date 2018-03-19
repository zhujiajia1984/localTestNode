// 
const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// 客户管理
module.exports = class Client {
    constructor(url) {
        this.url = url;
    }

    //
    async addClient(name) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('users').insertOne({ name: name });
        assert.equal(1, result.insertedCount);
        return client;
    }
}