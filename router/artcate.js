const express = require('express')

const router = express.Router()

const artcate_handler = require('../router_handler/artcate')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../scheme/artcate')

// 获取文章分类
router.get('/cates', artcate_handler.getArtCates)
// 新增文章分类，并对提交的表单数据进行验证
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArtCates)
// 根据id删除文章分类, 并对提交的id进行验证
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)
// 根据ID获取文章分类, 并对提交的id进行验证
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById)
// 根据ID更新文章分类, 并对提交的表单数据进行验证
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)

module.exports = router