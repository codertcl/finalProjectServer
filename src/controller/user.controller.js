const fs = require('fs')
const userService = require('../service/user.service')
// const fileService = require('../service/file.service')


class userController {
    //1:创建用户
    async register(ctx, next) {
        // 获取用户请求传递的参数
        const user = ctx.request.body
        // 获取SQL语句执行结果,设置到ctx.body中
        const res = await userService.create(user)
        // 返回数据
        if (res) {
            ctx.body = {
                status: 200,
                message: '注册成功,赶快登录吧'
            }
        } else {
            ctx.body = {
                status: 400,
                message: '该用户名已存在'
            }
        }
    }
}

module.exports=new userController()
