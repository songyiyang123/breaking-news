// 创建数据库的连接对象

// 导入mysql模块
const mysql = require('mysql')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01',

})

module.exports = db