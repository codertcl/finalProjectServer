//密码进行加密
const crypto = require('crypto')
const md5password = (password) => {
    //update()方法默认字符串编码为UTF-8，也可以传入Buffer。
    // 如果要计算SHA1，只需要把'md5'改成'sha1'，就可以得到SHA1的结果
    const md5 = crypto.createHash('md5');
    const result = md5.update(password).digest('hex')//转换为16进制
    return result;
}

module.exports = md5password;
