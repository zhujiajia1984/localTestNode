/* eslint-disable */
// 在mongo客户端中执行
let conn = new Mongo("mongodb_mongodb_1:27017");
let db = conn.getDB("client");
db.adminCommand('listDatabases');