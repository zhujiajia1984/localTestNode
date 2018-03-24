/* eslint-disable */
// 在mongo客户端中执行load("/data/db/js/clientInit.js")
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
                accountNum: {
                    bsonType: "long"
                },
                devNum: {
                    bsonType: "long"
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

db.runCommand({
    createIndexes: "client",
    indexes: [{
            key: { name: 1 },
            name: 'name_index',
            unique: true,
            background: true
        },
        {
            key: { shortName: 1 },
            name: 'shortName_index',
            background: true
        }, {
            key: { accountNum: -1 },
            name: 'accountNum_index',
            background: true
        }, {
            key: { devNum: -1 },
            name: 'devNum_index',
            background: true
        }, {
            key: { createTime: -1 },
            name: 'createTime_index',
            background: true
        }, {
            key: { lastModified: -1 },
            name: 'lastModified_index',
            background: true
        }
    ]
});