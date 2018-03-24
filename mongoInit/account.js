/* eslint-disable */
// 在mongo客户端中执行load("/data/db/js/account.js")
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("test");

// 客户表（表结构定义+索引）
printjson(db.account.drop());
db.createCollection("account", {
    validator: {
        $jsonSchema: {
            required: ["accountName", "createTime", "clientId"],
            properties: {
                accountName: {
                    bsonType: "long",
                    description: "must be a phone number and is required"
                },
                userName: {
                    bsonType: "string",
                    maxLength: 32,
                    description: "must be a string、max 32 bytes"
                },
                createTime: {
                    bsonType: "date"
                },
                lastLogin: {
                    bsonType: "date"
                },
                clientId: {
                    bsonType: "objectId"
                }
            }
        }
    }
});

db.runCommand({
    createIndexes: "account",
    indexes: [{
            key: { accountName: 1 },
            name: 'accountName_index',
            unique: true,
            background: true
        },
        {
            key: { createTime: 1 },
            name: 'createTime_index',
            background: true
        }, {
            key: { lastLogin: 1 },
            name: 'lastLogin_index',
            background: true
        }, {
            key: { clientId: 1 },
            name: 'clientId_index',
            background: true
        }
    ]
});