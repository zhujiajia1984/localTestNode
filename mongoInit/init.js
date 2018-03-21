/* eslint-disable */
// 在mongo客户端中执行load("/data/db/js/init.js")
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("test");

// 客户表（表结构定义+索引）
printjson(db.client.drop());
db.createCollection("client", {
    validator: {
        $jsonSchema: {
            required: ["name", "createTime", "lastModified"],
            properties: {
                name: {
                    bsonType: "string",
                    maxLength: 64,
                    minLength: 1,
                    description: "must be a string、max 64 bytes and is required"
                },
                shortName: {
                    bsonType: "string",
                    maxLength: 32,
                    description: "must be a string、max 32 bytes"
                },
                createTime: {
                    bsonType: "date"
                },
                lastModified: {
                    bsonType: "date"
                }
            }
        }
    }
});
db.client.createIndex({ name: 1 }, {
    background: true,
    unique: true,
    name: 'name_index'
});