// 路由处理函数模块，定义和用户相关的路由处理函数，供router/user.js模块使用

// 导入数据库模块
const db = require('../db/index')

// 用bcryptjs第三方包对密码进行加密处理
const bcrypt = require('bcryptjs')

// 产生Token的第三方包
const jwt = require('jsonwebtoken')
// 导入全局配置文件，包括token密钥
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body
    
    //查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err)

        // 查询用户名是否合法
        if(results.length > 0) res.cc('用户名被占用！请使用其他用户名！')
    })

    // 对用户密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    // 插入新用户
    const sql = 'insert into ev_users set ?'
    db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err)
        // 判断影响行数是否为1
        if(results.affectedRows !== 1) return res.cc('注册失败，请稍后再尝试！')
        // 注册用户成功
        res.cc('注册成功！', 0)
    })

}

// 登录的处理函数
exports.login = (req, res) => {
    const userinfo = req.body
    const sql = 'select * from ev_users where username = ?'
    db.query(sql, userinfo.username, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('登录失败！')

        // 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if(!compareResult) return res.cc('登录失败')

        // 在服务器端生成Token
        // 在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
        // 将results[0]对象结构，并且将其password和user_pic属性赋值为空字符串 
        const user = {...results[0], password: '', user_pic: ''}
        const token = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + token,
        })

    })
}
