const Router = require('koa-router');
const articleRouter = new Router()

const {
} = require('../middleware/user.middleware')

const {
    verifyAuth,
} = require('../middleware/auth.middleware')
const {
    getArticleInfo,
    refreshArticleInfo
} = require('../controller/article.controller')

// 1:获取论文数据(JSON格式处理)
articleRouter.get('/:username/getArticleInfo', verifyAuth, getArticleInfo)
// 2:更新用户的论文数据
articleRouter.post('/:username/refreshArticleInfo', refreshArticleInfo)
module.exports = articleRouter