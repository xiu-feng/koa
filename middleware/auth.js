const jwt = require('jsonwebtoken');

const User = require('../dao/base/user');
const config = require('config').get('jwt');
const { Unauthorized } = require('../lib/error');

module.exports = async (ctx, next) => {
    const { header: { token } } = ctx;

    if (token) {
        try {
            const decoded = jwt.verify(token, config.secret);
           
            const user = await User.findOne({ id: decoded.id });
         
            if (user && user.id) {
                ctx.currentUser = user;
                await next();
            } else {
                // throw new Unauthorized('Missing User');
                throw new Unauthorized('用户信息缺失');
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                // throw new Unauthorized('Token Expired');
                throw new Unauthorized('身份令牌过期');
            } else if (err.name === 'JsonWebTokenError') {
                // throw new Unauthorized('Invalid Token');
                throw new Unauthorized('身份令牌无效');
            } else {
                throw err;
            }
        }
    } else {
        // throw new Unauthorized('Missing Auth Token');
        throw new Unauthorized('身份令牌缺失');
    }
};
