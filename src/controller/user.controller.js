const fs = require('fs')
const path = require('path');
const axios = require('axios')
const {
    PythonShell
} = require('python-shell');
const userService = require('../service/user.service')
const jwt = require('jsonwebtoken')
const {
    PRIVATE_KEY
} = require("../app/config");


class userController {

    //// 0:获取用户名对应列表
    async getNameInfo(ctx, next) {
        // 获取用户请求传递的参数
        const {
            username
        } = ctx.query
        const res = await userService.getNameInfo(username)
        // const res = await axios.get(`https://dblp.org/search/author/api?q=${username}%3D&h=1000&format=json`)

        // 获取SQL语句执行结果,设置到ctx.body中
        // 无法直接返回JSON数据
        if (res.status === 200) {
            ctx.body = {
                status: 200,
                message: '获取用户信息成功',
                info: JSON.stringify(res.data)
            }
        } else {
            ctx.body = {
                status: 400,
                message: '获取用户信息失败',
            }
        }
    }

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


    // 2:用户登录
    async login(ctx, next) {
        // 获取用户请求传递的参数
        const {
            id,
            username
        } = ctx.user
        // 私钥加密 公钥解密 生成token
        const token = jwt.sign({
            id,
            username
        }, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'RS256'
        })
        ctx.body = {
            status: 200,
            message: '登录成功~',
            info: ctx.user,
            token
        }
    }

    //3:更新用户信息
    async updateUserInfo(ctx, next) {
        //1:获取用户id
        const {
            id
        } = ctx.params

        //2:将信息存储到user表中
        const res = await userService.updateUserInfo(ctx.request.body, id)

        if (res) {
            ctx.body = {
                status: 200,
                message: '更新用户信息成功'
            }
        } else {
            ctx.body = {
                status: 400,
                message: '该用户名已存在'
            }
        }
    }

    //4:更新用户密码
    async updatePassword(ctx, next) {
        //1:获取用户id
        const {
            id
        } = ctx.params
        const {
            password
        } = ctx.request.body

        //2:将信息存储到user表中
        const res = await userService.updatePassword(password, id)
        if (res) {
            ctx.body = {
                status: 200,
                message: '更新用户密码成功'
            }
        }
    }

    //5:更新用户教育信息
    async updateProfileEducation(ctx, next) {
        //1:获取用户id
        const {
            id
        } = ctx.params

        //2:将信息存储到user表中
        const res = await userService.updateProfileEducation(ctx.request.body, id)

        if (res) {
            ctx.body = {
                status: 200,
                message: '更新用户信息成功'
            }
        } else {
            ctx.body = {
                status: 400,
                message: '更新失败'
            }
        }
    }

    //6:获取用户论文信息
    async getArticleInfo(ctx, next) {
        //1:获取用户名
        const {
            username
        } = ctx.params

        //2:将信息存储到dblp表中
        let res = await userService.getArticleInfo(username)
        // console.log(res.length);
        // 返回的数组为空，即用户信息还没有插入到mysql
        if (!res.length) {
            axios.get(`https://dblp.org/search/publ/api?q=${username}&h=1000&format=xml`)
                .then(async re => {
                    let filename = path.resolve('src/py/data', `${username}.xml`)
                    let options = {
                        mode: 'text',
                        args: [filename, username]
                    }
                    fs.writeFile(filename, re.data, {
                        flag: 'w'
                    }, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    PythonShell.run('./src/py/api/getArticleInfo.py', options, async function (err) {
                        if (err) throw err;
                        console.log('finished');
                        // 3:获取dblp表中该作者的论文数据
                        const articleInfo = await userService.getArticleInfo(username)
                        // console.log(articleInfo);
                        ctx.body = {
                            status: 200,
                            message: '获取论文信息成功',
                            info: articleInfo
                        }
                    });

                    // // 3:获取dblp表中该作者的论文数据
                    // const articleInfo = await userService.getArticleInfo(username)
                    // console.log(articleInfo);
                    // ctx.body = {
                    //     status: 200,
                    //     message: '获取论文信息成功',
                    //     info: articleInfo
                    // }
                }).catch(err => {
                    ctx.body = {
                        status: 500,
                        message: '获取论文信息失败',
                    }
                })
        } else {
            ctx.body = {
                status: 200,
                message: '获取论文信息成功',
                info: res
            }
        }
    }
}

module.exports = new userController()
