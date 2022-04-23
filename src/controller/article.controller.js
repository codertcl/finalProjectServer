const articleService = require('../service/article.service')

class articleController {
    // 1:获取论文数据
    async getArticleInfo(ctx, next) {
        //1:获取用户名
        const {
            username
        } = ctx.params

        // 2:判断数据库内是否已经存储了该用户的数据
        const info = await articleService.getArticleInfo(username)
        // 已经存在于mysql中
        if (info.length) {
            ctx.body = {
                status: 200,
                message: '获取论文信息成功',
                info
            }
        } else {
            const res = await articleService.insertArticle(username)
            if (res) {
                ctx.body = {
                    status: 200,
                    message: '获取论文信息成功',
                    info: res
                }
            } else {
                ctx.body = {
                    status: 500,
                    message: '获取论文信息失败',
                }
            }
        }
    }

    // 2:更新用户论文数据
    async refreshArticleInfo(ctx, next) {
        const {
            username
        } = ctx.params
        // 先删除用户论文数据
        await articleService.deleteArticleInfo(username)
        // 2:判断数据库内是否已经存储了该用户的数据
        const info = await articleService.getArticleInfo(username)
        // 已经存在于mysql中
        if (info.length) {
            ctx.body = {
                status: 200,
                message: '获取论文信息成功',
                info
            }
        } else {
            const res = await articleService.insertArticle(username)
            console.log(res.length);
            if (res) {
                ctx.body = {
                    status: 200,
                    message: '获取论文信息成功',
                    info: res
                }
            } else {
                ctx.body = {
                    status: 500,
                    message: '获取论文信息失败',
                }
            }
        }
    }

}
module.exports = new articleController()