const Router = require('@koa/router')

const config = require('config')

const router = new Router(config.get('router.api'))

// router是一单例，不管应用中多少次require这个文件，都返回同一router
// ref: https://stackoverflow.com/questions/13179109/singleton-pattern-in-nodejs-is-it-needed
module.exports = router
