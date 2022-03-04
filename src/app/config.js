const fs = require("fs")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config() //默认读取项目根目录下的.env文件

const private_key_url = path.resolve(__dirname, "./keys/private.key")
const public_key_url = path.resolve(__dirname, "./keys/public.key")
const PRIVATE_KEY = fs.readFileSync(private_key_url)
const PUBLIC_KEY = fs.readFileSync(public_key_url)

// 等价于
// const { APP_PORT } = process.env
// module.exports = { APP_PORT }
module.exports = {
    APP_HOST,
    APP_PORT,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DATABASE,
    MYSQL_USER,
    MYSQL_PASSWORD
} = process.env

module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBLIC_KEY = PUBLIC_KEY