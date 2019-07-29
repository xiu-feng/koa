const Koa = require('koa')
const Router = require('@koa/router')
const webSockify = require('koa-websocket')
const cors = require('@koa/cors')
const compress = require('koa-compress')
const body = require('koa-body')
const validate = require('koa-validate')
const config = require('config')
const errorHandler = require('./lib/error-handler')
const app = new Koa()
const apiRouters = require('./api/routers')
const unimplemented = require('./lib/unimplemented')
const render = require('koa-art-template')
const static = require('koa-static')
const path=require('path')
// submqtt.sub();
//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});
//配置 静态资源的中间件
app.use(static(__dirname + '/public'));
// enable cors
// app.use(cors());

// HTTP compression
app.use(compress({}));

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
    const t1 = Date.now();
    await next();
    const t2 = Date.now();
    ctx.response.set('X-Response-Time', Math.ceil(t2-t1)+'ms');
});

// request parameters parser
app.use(body({
    formidable: {
        uploadDir: `${__dirname}/public/uploads`, // This is where the files will be uploaded
        keepExtensions: true,
    },
    multipart: true,
    urlencoded: true,
}));

// error handler
app.use(errorHandler);

// validator
validate(app);

// HTTP routes
const apiAuthRouter = require('./lib/auth-router')
const apiRouter = require('./lib/router')
app.use(apiAuthRouter.routes())
   .use(apiRouter.routes())
   .use(unimplemented.routes())

// WebSocket routes
// webSockify(app);
// const wsRouter = require('./lib/router-ws')
// app.ws
//   .use(wsRouter.routes())
//   .use(unimplementedWs.routes())

// start server
const serverPort = config.get('server.port')
app.listen(serverPort);
