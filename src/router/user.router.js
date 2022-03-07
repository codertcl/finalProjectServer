const Router = require('koa-router');
const userRouter = new Router()

const {
    verifyUser,
    handlePassword
} = require('../middleware/user.middleware')

const {
    // verifyAuth,
    // verifyPermission,
    verifyLogin
} = require('../middleware/auth.middleware')
const {
    register,
    login,
    updateUserInfo
} = require('../controller/user.controller')

// 1:用户注册
userRouter.post('/register', verifyUser, handlePassword, register)
// 2:用户登录
userRouter.post('/login', verifyLogin, login)
// 3:用户信息修改
userRouter.patch('/:id/userInfo', verifyLogin, updateUserInfo)
module.exports = userRouter