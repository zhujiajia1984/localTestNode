/* eslint-disable */
// 执行mongo /data/db/js/polygon.js
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("test");

// 客户表（表结构定义+索引）
printjson(db.polygon.drop());
db.createCollection("polygon", {
    validator: {
        $jsonSchema: {
            required: ["lng", "lat"],
            properties: {
                lng: {
                    bsonType: "string",
                },
                lat: {
                    bsonType: "string",
                },
                createTime: {
                    bsonType: "date"
                }
            }
        }
    }
});