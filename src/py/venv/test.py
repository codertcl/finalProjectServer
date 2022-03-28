import xml.sax


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
        self.access = ""
        self.key = ""
        self.doi = ""
        self.ee = ""
        self.url = ""

    # 元素开始事件处理
    def startElement(self, tag, attributes):
        self.CurrentData = tag

    # 元素结束事件处理
    def endElement(self, tag):
        #print(tag)
        if tag == "info":
            print(self.authors)
            print(self.title)
            # sql
            self.authors.clear()
        self.CurrentData = ""

    # 内容事件处理
    def characters(self, content):
        if self.CurrentData == "author":
            self.authors.append(content)
        elif self.CurrentData == "title":
            self.title = content
        ‘’‘

if (__name__ == "__main__"):
    # 创建一个 XMLReader
    parser = xml.sax.make_parser()
    # turn off namepsaces
    parser.setFeature(xml.sax.handler.feature_namespaces, 0)

    # 重写 ContextHandler
    Handler = InfoHandler()
    parser.setContentHandler(Handler)
    parser.parse("F:\\bs\\my\\code\\dblp-parse\\py\\test.xml")