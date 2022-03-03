const Router = require('koa-router');
const userRouter = new Router()

const {
    // verifyUser,
    handlePassword
} = require('../middleware/user.middleware')

const {
    // verifyAuth,
    // verifyPermission,
    // verifyLogin
} = require('../middleware/auth.middleware')
const {
    register
} = require('../controller/user.controller')

// 1:注册用户
userRouter.post('/register', handlePassword, register)
// 2:注册用户
// userRouter.post('/login', handlePassword, login)
module.exports = userRouter