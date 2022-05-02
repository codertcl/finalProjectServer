const Router = require('koa-router');
const userRouter = new Router()

const {
    verifyUser,
    handlePassword
} = require('../middleware/user.middleware')

const {
    verifyAuth,
    verifyLogin
} = require('../middleware/auth.middleware')
const {
    register,
    login,
    updateUserInfo,
    updatePassword,
    updateProfileEducation,
    getArticleInfo,
    getNameInfo
} = require('../controller/user.controller')


// 0:获取用户名对应列表
userRouter.get('/getNameInfo', verifyUser, getNameInfo)
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
//:6获取用户论文信息
// userRouter.get('/:username/getArticleInfo', verifyAuth, getArticleInfo)
module.exports = userRouter