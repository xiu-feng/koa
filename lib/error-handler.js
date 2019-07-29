const ExtendableError = require('es6-error');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof ExtendableError) {
            ctx.status = err.status;
            ctx.body = err.body;
        } else {
            ctx.status = 500;
            ctx.body = {
                errors: [{
                    message: err.message,
                    // stack: err.stack, // remove in production
                }],
            };
        }
        ctx.app.emit('error', err, ctx);
    }
};
