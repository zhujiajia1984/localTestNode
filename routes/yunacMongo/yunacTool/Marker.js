// 
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

// 客户管理
module.exports = class Marker {
    constructor(url) {
        this.url = url;
    }

    // 新增marker
    async addMarker(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('marker').insertOne({
            name: data.name,
            desp: typeof(data.desp) == "undefined" ? '' : data.desp,
            type: data.type,
            lng: data.lng,
            lat: data.lat,
            thumb: data.thumb,
            audio: typeof(data.audio) == "undefined" ? '' : data.audio,
            createTime: new Date(),
            richText: typeof(data.richText) == "undefined" ? '' : data.richText,
        });
        assert.equal(1, result.insertedCount);
        client.close();
        return result.ops[0];
    }

    // 查询marker
    async findMarker(id) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let query = {};
        if (id) {
            query = { _id: new ObjectID(id) };
        }
        let result = await db.collection('marker').find(query).toArray();

        // output
        client.close();
        return result;
    }

    // 删除marker
    async delMarker(id) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('marker').deleteOne({ _id: new ObjectID(id) });
        assert.equal(1, result.deletedCount);
        client.close();
        return result;
    }

    // 更新marker
    async updateMarker(data) {
        const client = await MongoClient.connect(this.url);
        const db = client.db("test");
        let result = await db.collection('marker').updateOne({ _id: new ObjectID(data.id) }, {
            $set: {
                name: data.name,
                desp: typeof(data.desp) == "undefined" ? '' : data.desp,
                type: data.type,
                lng: data.lng,
                lat: data.lat,
                thumb: data.thumb,
                audio: typeof(data.audio) == "undefined" ? '' : data.audio,
                richText: typeof(data.richText) == "undefined" ? '' : data.richText,
            }
        });
        assert.equal(1, result.matchedCount);
        assert.equal(1, result.modifiedCount);
        client.close();
        return result;
    }
}