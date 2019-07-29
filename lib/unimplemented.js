const Router     = require('@koa/router');
const { NotFound } = require('../lib/error');

const router     = new Router();
router.get('/*', ctx => {
    throw new NotFound('功能不存在')
});

module.exports = router
