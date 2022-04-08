const Router = require('koa-router');
const articleRouter = new Router()

const {
} = require('../middleware/user.middleware')

const {
    verifyAuth,
} = require('../middleware/auth.middleware')
const {
    getArticleInfo,
} = require('../controller/article.controller')

articleRouter.get('/:username/getArticleInfo', verifyAuth, getArticleInfo)
module.exports = articleRouter