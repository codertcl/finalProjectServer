import xml.sax
import pymysql.cursors
import  sys
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
            # 构造SQL语句
            with connection.cursor() as cursor:
                sqlStr = "INSERT INTO `dblp` "
                sqlStr += "(`authors`,`title`,`venue`,`volume`,`number`,`pages`,`year`,`type`,`key`,`doi`,`ee`,`url`) "
                sqlStr += "VALUES ("
                auStr = ""
                for au in self.authors:
                    auStr += au + ","
                sqlStr += "'" + auStr[:auStr.__len__()-1] + "',"
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
                print(sqlStr)
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
    #获取js代码传递的论文文件名 
    filename= sys.argv[1]
    parser = xml.sax.make_parser()
    parser.setFeature(xml.sax.handler.feature_namespaces, 0)
    Handler = InfoHandler()
    parser.setContentHandler(Handler)
    parser.parse(filename)