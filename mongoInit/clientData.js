/* eslint-disable */
// 在mongo客户端中执行load("/data/db/js/clientData.js")
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("test");

// 删除数据
db.getCollection("client").deleteMany({});

// 创建数据
let data = [];
for (let i = 0; i < 50; i++) {
    let time1 = new Date();
    let time2 = new Date(time1.getTime() + 1000 * 60 * i); // 加i分钟
    data.push({
        name: `测试${i}`,
        shortName: i % 2 == 0 ? '' : `test${i}`,
        createTime: time1,
        lastModified: time2,
    })
}
db.getCollection("client").insertMany(data);