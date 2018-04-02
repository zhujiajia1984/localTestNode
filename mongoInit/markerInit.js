/* eslint-disable */
// 执行mongo /data/db/js/markerInit.js
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("test");

// 客户表（表结构定义+索引）
printjson(db.marker.drop());
db.createCollection("marker", {
    validator: {
        $jsonSchema: {
            required: ["name", "type", "lng", "lat", "thumb"],
            properties: {
                name: {
                    bsonType: "string",
                },
                type: {
                    bsonType: "string",
                },
                lng: {
                    bsonType: "double",
                },
                lat: {
                    bsonType: "double",
                },
                thumb: {
                    bsonType: "string",
                },
                createTime: {
                    bsonType: "date"
                }
            }
        }
    }
});