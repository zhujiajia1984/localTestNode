// 
const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// 客户管理
module.exports = class Client {
    constructor(url) {
        this.url = url;
    }

    //
    async addClient(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('client').insertOne({
            name: typeof(data.name) == "undefined" ? '' : data.name,
            shortName: typeof(data.shortName) == "undefined" ? '' : data.shortName
        });
        assert.equal(1, result.insertedCount);
        client.close();
        return result.ops[0];
    }
}