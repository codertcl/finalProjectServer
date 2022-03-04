const jwt = require('jsonwebtoken')

const errorType = require('../constants/error-types')
const userService = require('../service/user.service')
// const authService = require('../service/auth.service');
const md5password = require('../utils/password-handle')
const {
    PUBLIC_KEY
} = require('../app/config')
//验证用户登录信息
const verifyLogin = async (ctx, next) => {
    //1:获取用户信息
    const {
        username,
        password
    } = ctx.request.body
    //2:用户信息不能为空  空字符串==null false  !''为TRUE
    if (!username || !password) {
        const error = new Error(errorType.NAME_OR_PASSWORD_IS_NOT_REQUIRED)
        return ctx.app.emit('error', error, ctx) //第一个参数为事件名称 后面为参数
    }
    //3:判断本次注册用户是否已经存在
    const result = await userService.getUserByName(username); ////存储查询到的信息
    const user = result[0] //查询到用户信息

    if (!user) { //用户不存在
        const error = new Error(errorType.USER_NOT_EXISTS)
        return ctx.app.emit('error', error, ctx)
    }

    //4:用户存在了，则判断密码是否正确
    //用户输入的密码加密后和数据库内存储的加密后密码是否不同
    if (md5password(password) !== result[0].password) {
        const error = new Error(errorType.PASSWORD_WRONG)
        return ctx.app.emit('error', error, ctx)
    }

    ctx.user = user

    // 5:执行下一个中间件
    await next()
}

//判断是否认证成功
const verifyAuth = async (ctx, next) => {
    //1:获取token
    const authorization = ctx.headers.authorization;
    if (!authorization) { //判断是否携带token
        return ctx.app.emit('error', new Error(errorType.UNAUTHORIAZTION), ctx)
    }
    const token = authorization.replace('Bearer ', '')
    //2:验证token (token携带的数据)
    try {
        ctx.user = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256']
        })
        await next()
    } catch (e) {
        console.log(e)
        const error = new Error(errorType.UNAUTHORIAZTION)
        ctx.app.emit('error', error, ctx)
    }
}

/**
 * 1.很多的内容都需要验证权限: 修改/删除动态, 修改/删除评论
 * 2.接口: 业务接口系统/后端管理系统
 *  一对一: user -> role
 *  多对多: role -> menu(删除动态/修改动态)
 *
 * 3.传入表名方式
 *  3.1:使用闭包，verifyPermission函数参数为tableName，在router文件中传入
 *      将校验函数作为返回值返回，并在router文件中调用
 *  3.2: 通过Object.keys(ctx.params)获取到在url中传入的参数{commentId:}或者{moemntId:}
 *      通过replace方法获取到要操作的表名tableName
 */
//
const verifyPermission = async (ctx, next) => {
    const {
        id
    } = ctx.user;
    //获取当前操作的表名
    const [resourceKey] = Object.keys(ctx.params)
    let tableName = resourceKey.replace('Id', '')
    let resourceId = ctx.params[resourceKey]
    //2:查询要修改/删除的信息对应的用户 判断是否是本人的
    const isPremit = await authService.checkResource(tableName, resourceId, id)
    if (isPremit) {
        await next()
    } else {
        const error = new Error(errorType.UNPERMISSION)
        ctx.app.emit('error', error, ctx)
    }
}


// 判断用户在查看自己关注的人的所有动态列表时是否有权限
const verifyGetPermission = async (ctx, next) => {
    //1:获取要查看的所有关注者动态列表的用户id
    const {
        userId
    } = ctx.params;
    // 当前登录的用户id
    const {
        id
    } = ctx.user;

    //2:判断请求路径中的用户id 判断是否是本人的
    if (id == userId) {
        await next()
    } else {
        const error = new Error(errorType.UNPERMISSION)
        ctx.app.emit('error', error, ctx)
    }
}

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission,
    verifyGetPermission
}