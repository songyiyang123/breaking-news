// 用户的路由模块
const express = require('express');
// 创建路由对象
const router = express.Router();

// 导入路由处理函数对应的模块
const {regUser, login} = require('../router_handler/user')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { reg_login_schema } = require('../scheme/user')

// 注册新用户
// 使用第三方验证模块对表单数据进行合法性校验
// 1. 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 2. 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/reguser',expressJoi(reg_login_schema), regUser)

// 登录
// 使用和注册相同的校验规则
router.post('/login',expressJoi(reg_login_schema), login)

module.exports = router

