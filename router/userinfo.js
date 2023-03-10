const express = require('express')
const router = express.Router()

// 导入路由处理函数模块
const userinfoRouter = require('../router_handler/userinfo')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../scheme/user')

// 获取用户信息路由
router.get('/userinfo', userinfoRouter.getUserInfo)
// 更新用户信息之前要先验证表单提交的信息合法性
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfoRouter.updateUserInfo)
// 重置密码路由，之前要进行验证
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
// 更换头像路由，之前要进行验证
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router