// 导入表单数据合法性校验第三方模块
const joi = require('@hapi/joi')

// 导入 express
const express = require('express')
// 创建服务器实例对象
const app = express()

// 导入并配置 cors中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据中间件 application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}))

/* 在处理函数中，需要多次调用 res.send() 向客户端响应 处理失败 的结果，
为了简化代码，可以手动封装一个 res.cc() 函数 */
// 在 app.js 中，所有路由之前，声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数 
app.use((req, res, next) => {
  // 默认值为1，表示失败情况。失败不需要传递status参数
  res.cc = function(err, status = 1){
    res.send({
      status,
      // err 是描述信息还是错误对象
      message: err instanceof Error ? err.message : err,
    })
  }
  next()

})

// 配置解析token中间件,一定要在定义res.cc之后，不然捕获token错误里使用res.cc会报错，因为代码为顺序执行
const expressjwt = require('express-jwt')
const config = require('./config')
app.use(expressjwt({ secret : config.jwtSecretKey }).unless({path: [/^\/api\//] }))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 导入并使用文章分类路由模块
const userCateRouter = require('./router/artcate')
app.use('/my/article', userCateRouter)

// 导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 定义错误级别的中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if(err instanceof joi.ValidationError) return res.cc(err)

  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})


// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http:127.0.0.1:3007')
})
