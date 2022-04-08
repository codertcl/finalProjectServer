const connection = require('../app/database')
const axios = require('axios')

class articleService {
    ////1:通过接口https://dblp.org/search/publ/api?q=deze%20zeng&h=1000&format=json
    ////获取到JSON格式的论文数据并存储到mysql中
    async insertArticle(username) {
        const res = await axios.get(`https://dblp.org/search/publ/api?q=${username}&h=1000&format=json`)

        // 获取数据成功时 构造SQL语句 插入数据到mysql中 
        if (res.data.result.status['@code'] === "200") {
            for (const item of res.data.result.hits.hit) {
                let authors = "",
                    sql = "INSERT INTO `dblp` (`authors`,`author`,`title`,`venue`,`volume`,`number`,`pages`,`year`,`type`,`key`,`doi`,`ee`,`url`) VALUES ("
                for (const au of item.info.authors.author) {
                    authors += au.text + ' ,'
                }
                if (authors.toLocaleLowerCase().includes(username.toLocaleLowerCase())) {
                    authors = authors.substring(0, authors.length - 1)
                    sql = sql + "'" + authors + "', '" + username + "', '" + item.info.title + "', '" + item.info.venue + "', '" +
                        item.info.volunme + "', '" + item.info.number + "', '" + item.info.pages + "', '" + item.info.year +
                        "', '" + item.info.type + "', '" + item.info.key + "', '" + item.info.doi + "', '" + item.info.ee + "', '" + item.info.url + "') "
                    // console.log(sql);
                    // console.log('\n');
                    await connection.execute(sql)
                }
            }
            return this.getArticleInfo(username)
        } else {
            return false
        }
    }

    ////2:通过username获取dblp表中用户的论文信息(JSON格式 返回给前端需要转换为字符串或者对象)
    async getArticleInfo(username) {
        const statement = `select * from dblp where author = ?;`;
        let res = await connection.execute(statement, [username]);
        return res[0]
    }
}


module.exports = new articleService()