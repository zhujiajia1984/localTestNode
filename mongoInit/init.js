/* eslint-disable */
// 在mongo客户端中执行load("/data/db/js/create")
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("test");

// 格式校验
printjson(db.createCollection("client", {
    validator: {
        $jsonSchema: {
            required: ["name"],
            properties: {
                name: {
                    bsonType: "string",
                    maxLength: 64,
                    minLength: 1,
                    description: "must be a string max 64bytes and is required"
                }
            }
        }
    }
}));