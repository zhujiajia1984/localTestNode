/* eslint-disable */
// 在mongo客户端中执行load("/data/db/js/accountData.js")
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("test");

// 删除数据
db.getCollection("account").deleteMany({});

// 获取client集合的ObjectId
let clientIds = [];
db.getCollection("client").find({}, { _id: 1 })
    .forEach((doc) => {
        clientIds.push(doc._id);
    });
// printjson(clientIds);

// 创建数据
let data = [];
let count = 50;
let accountNumStart = 10000000000;
for (let i = 0; i < clientIds.length; i++) {
    for (let j = 0; j < count; j++) {
        let time1 = new Date();
        let time2 = new Date(time1.getTime() - (1000 * 60 * (i * count + j))); // -i分钟
        data.push({
            accountName: NumberLong(i * count + j + accountNumStart),
            userName: j % 2 == 0 ? '' : `使用者${i * count + j}`,
            createTime: time2,
            clientId: clientIds[i]
        })
    }
}
db.getCollection("account").insertMany(data);