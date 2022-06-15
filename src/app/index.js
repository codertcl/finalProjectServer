const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const errorHandler = require('./error-handle')
const useRoutes = require('../router/index')
const app = new Koa()
var cors = require('koa2-cors');
app.use(cors());
app.use(bodyParser());
//注册使用路由 useRoutes函数中this绑定到了app
app.useRoutes = useRoutes;
app.useRoutes()
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', "http://localhost:8888");
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Allow-Methods', "OPTIONS, GET, PUT, POST, DELETE")
    await next();
});
// 捕获错误
app.on('error', function (err, ctx) {
    console.log('server error', err, ctx);
});
//错误处理
app.on('error', errorHandler)
module.exports = app