// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类列表处理函数
exports.getArtCates = (req, res) => {
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'

    db.query(sql, req.user.id, (err, results) => {
        if(err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类数据成功!',
            data: results,
        })
    }) 

}

// 新增文章分类处理函数
exports.addArtCates = (req, res) => {
    // 查询新增的分类名称或者别名是否被占用
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if(err) return res.cc(err)
        if(results.length === 2 ) return res.cc('分类名称和别名被占用，请更换后重试')
        else if(results.length && results[0].name === req.body.name && results[0].alias === req.body.alias){
            return res.cc('分类名称和别名被占用，请更换后重试')
        } 
        else if(results.length && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试')
        else if(results.length && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试')
    }) 

    // 新增文章分类
    const sqlStr = `insert into ev_article_cate set ?`
    db.query(sqlStr, req.body, (err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('新增文章分类失败')
        res.cc('新增文章分类成功！', 0)
    }) 

}

// 新增根据id删除文章分类处理函数
exports.deleteCateById = (req, res) => {
    // 根据id删除文章分类
    // 标记删除
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1 ) return res.cc('删除文章分类失败')
        res.cc('删除文章分类成功！', 0)
    }) 

}

// 根据id获取文章分类处理函数
exports.getArtCateById = (req, res) => {
    // 根据id获取文章分类
    const sql = 'select * from ev_article_cate where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1 ) return res.cc('根据id获取文章分类失败')
        res.send({
            status: 0,
            message: '根据id获取文章分类成功！',
            data: results[0],
        })
    }) 

}

// 根据id更新文章分类处理函数
exports.updateCateById = (req, res) => {
    // 查询分类名称和分类别名是否被占用
    const sqlStr = 'select * from ev_article_cate where Id<>? and (name=? or alias=?)'
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if(err) return res.cc(err)
        if(results.length === 2 ) return res.cc('分类名称和别名被占用，请更换后重试')
        else if(results.length && results[0].name === req.body.name && results[0].alias === req.body.alias){
            return res.cc('分类名称和别名被占用，请更换后重试')
        } 
        else if(results.length && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试')
        else if(results.length && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试')
    }) 

    // 根据id更新文章分类
    const sql = 'update ev_article_cate set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1 ) return res.cc('根据id更新文章分类失败')
        return res.cc('根据id更新文章分类成功!', 0)
    }) 

}