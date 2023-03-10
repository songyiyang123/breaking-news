// 导入数据库模块
const db = require('../db/index')

// 用bcryptjs第三方包对密码进行加密处理
const bcrypt = require('bcryptjs')

// 获取用户信息的处理函数
exports.getUserInfo = (req, res) => {
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id = ?'
    // req.user.id 获取token中的用户信息
    db.query(sql, req.user.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('获取用户信息失败！')
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
    })
}


// 更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
      
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })
}

// 重置用户密码处理函数
exports.updatePassword = (req, res) => {
    const sql = `select * from ev_users where id = ?`
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.length !== 1) return res.cc('重置用户密码失败！')
      
        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
    })

    // 对新密码进行加密并存入数据库
    const sqlStr = `update ev_users set password=? where id=?`

    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    
    // 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
        // SQL 语句执行失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新密码失败！')

        // 更新密码成功
        res.cc('更新密码成功！', 0)
    })
}

// 更新头像处理函数
exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set user_pic=? where id = ?`
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('更换头像失败！')
      
        // 更新密码成功
        res.cc('更换头像成功！', 0)
    })
}
