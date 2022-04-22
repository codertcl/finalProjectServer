import xml.sax
import pymysql.cursors
import sys

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='1111',
    db='data',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor)


class InfoHandler(xml.sax.ContentHandler):
    def __init__(self):
        self.CurrentData = ""
        self.authors = []
        self.title = ""
        self.venue = ""
        self.volume = ""
        self.number = ""
        self.pages = ""
        self.year = ""
        self.type = ""
        self.key = ""
        self.doi = ""
        self.ee = ""
        self.url = ""

    # 元素开始事件处理
    def startElement(self, tag, attributes):
        self.CurrentData = tag

    # 元素结束事件处理
    def endElement(self, tag):
        if tag == "info":
            # 注册用户名字字母可能大写也可能小写，dblp都能获取到数据
            # 但获取到的数据名字存在小写，所以转换为小写进行判断
            tempAuthors = []
            for au in self.authors:
                tempAuthors.append(au.lower())
            # 获取到数据有部分匹配的 包含了其他数据
            # xml文件中* chen,weitao *也被匹配到所以需要精确匹配
            if author.lower() in tempAuthors:
                # 构造SQL语句
                with connection.cursor() as cursor:
                    sqlStr = "INSERT INTO `dblp` "
                    sqlStr += "(`authors`,`author`,`title`,`venue`,`volume`,`number`,`pages`,`year`,`type`,`key`,`doi`,`ee`,`url`) "
                    sqlStr += "VALUES ("
                    auStr = ""
                    for au in self.authors:
                        auStr += au + ","
                    sqlStr += "'" + auStr[:auStr.__len__() - 1] + "',"
                    sqlStr += "'" + author + "',"
                    sqlStr += "'" + self.title + "',"
                    sqlStr += "'" + self.venue + "',"
                    sqlStr += "'" + self.volume + "',"
                    sqlStr += "'" + self.number + "',"
                    sqlStr += "'" + self.pages + "',"
                    sqlStr += "'" + self.year + "',"
                    sqlStr += "'" + self.type + "',"
                    sqlStr += "'" + self.key + "',"
                    sqlStr += "'" + self.doi + "',"
                    sqlStr += "'" + self.ee + "',"
                    sqlStr += "'" + self.url + "'"
                    sqlStr += ")"
                    # print(sqlStr)
                    cursor.execute(sqlStr)
                    # 创建的connection是非自动提交，需要手动commit
                connection.commit()
            self.authors.clear()
        else:
            self.CurrentData = ""

    # 内容事件处理
    def characters(self, content):
        if self.CurrentData == "author":
            self.authors.append(content)
        elif self.CurrentData == "title":
            self.title = content
        elif self.CurrentData == "venue":
            self.venue = content
        elif self.CurrentData == "volume":
            self.volume = content
        elif self.CurrentData == "number":
            self.number = content
        elif self.CurrentData == "pages":
            self.pages = content
        elif self.CurrentData == "year":
            self.year = content
        elif self.CurrentData == "type":
            self.type = content
        elif self.CurrentData == "key":
            self.key = content
        elif self.CurrentData == "doi":
            self.doi = content
        elif self.CurrentData == "ee":
            self.ee = content
        elif self.CurrentData == "url":
            self.url = content


if (__name__ == "__main__"):
    # 写入参数到文件
    # path = '1.txt'
    # with open(path, 'w') as file_object:
    #  for a in sys.argv:
    #     file_object.write(a)
    #     file_object.write('\n')
    # 获取js代码传递的论文文件名
    filename = sys.argv[1]
    author = sys.argv[2]  # 当前查询的用户的名称
    parser = xml.sax.make_parser()
    parser.setFeature(xml.sax.handler.feature_namespaces, 0)
    Handler = InfoHandler()
    parser.setContentHandler(Handler)
    parser.parse(filename)