const Router = require('koa-router');
const userRouter = new Router()

const {
    verifyUser,
    handlePassword
} = require('../middleware/user.middleware')

const {
    verifyAuth,
    // verifyPermission,
    verifyLogin
} = require('../middleware/auth.middleware')
const {
    register,
    login,
    updateUserInfo,
    updatePassword,
    updateProfileEducation
} = require('../controller/user.controller')

// 1:用户注册
userRouter.post('/register', verifyUser, handlePassword, register)
// 2:用户登录
userRouter.post('/login', verifyLogin, login)
// 3:用户信息修改
userRouter.post('/:id/updateUserInfo', verifyAuth, updateUserInfo)
//4:更新用户密码
userRouter.patch('/:id/updatePassword', verifyAuth, handlePassword, updatePassword)
//:5更新用户学术信息
userRouter.patch('/:id/updateProfileEducation', verifyAuth, updateProfileEducation)
module.exports = userRouter