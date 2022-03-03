const connection = require('../app/database')

class userService {
    // //插入数据到user中
    async create(user) {
        //执行SQL语句,返回结果
        const {
            username,
            password
        } = user

        // 注册的用户的名字不能重复
        let executeRes = await connection.execute('SELECT * FROM user WHERE username= ?;', [username]);
        // console.log(executeRes);
        // console.log(executeRes[0]);
        // console.log(executeRes[0].length);
        // 判断该用户名对应用户是否存在 如果存在且查到的用户id和当前登录用户id不同 则该用户名会重复 提示错误
        if (executeRes[0].length) {
            return false
        }

        console.log(username, password);
        const statement = 'INSERT into user (username,password) VALUES (?,?);';
        const result = await connection.execute(statement, [username, password]);
        console.log(result);
        return result
    }
}


module.exports = new userService()