const Koa_Logger  = require("koa-logger");  
const Moment = require("moment");

const logger = Koa_Logger ((ctx) => {                // 使用日志中间件
    console.log(Moment().format('YYYY-MM-DD HH:mm:ss')+ctx);
    // console.log(ctx);
});

module.exports = logger;