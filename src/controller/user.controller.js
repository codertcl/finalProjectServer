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

        //2:将信息存储到user表中
        const res = axios.get(`https://dblp.org/search/publ/api?q=${username}&h=1000&format=xml`)
            .then(re => {
                // let options = {
                //     mode: 'text',
                //     pythonPath: 'path/to/python',
                //     pythonOptions: ['-u'], // get print results in real-time
                //     scriptPath: 'path/to/my/scripts',
                //     args: path.resolve('src/py/data', `${username}.xml`)
                // };
                let filename = path.resolve('src/py/data', `${username}.xml`)
                fs.writeFile(filename, re.data, {
                    flag: 'w'
                }, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                PythonShell.run('./src/py/main.py', null, function (err) {
                    if (err) throw err;
                    console.log('finished ');
                });
            }).catch(err => {
                console.log(err);
            })

        // if (res) {
        //     ctx.body = {
        //         status: 200,
        //         message: '更新用户信息成功'
        //     }
        // } else {
        //     ctx.body = {
        //         status: 400,
        //         message: '更新失败'
        //     }
        // }
    }



}

module.exports = new userController()