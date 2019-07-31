const router = require('../../lib/router');

const User = require('../../dao/base/user');
const Logger = require('../../dao/base/logger')
const jwt = require('../../lib/jwt');
const { BadRequest, Unauthorized } = require('../../lib/error');
const string = require('../../lib/string');

/**
 * @api {post} /login User Login
 * @apiVersion 1.0.0
 * @apiGroup Auth
 * @apiName UserLogin
 * @apiParam {String{1,255}} email user email
 * @apiParam {String{1,20}} password user password
 * @apiSampleRequest /api/login
 */
router.post('/login', async (ctx) => {
    ctx.checkBody('username').notEmpty('username field is required').len(4, 50, 'username length must be between 4 and 50 characters');
    ctx.checkBody('password').notEmpty('Password field is required').len(4, 20, 'Password length must be between 4 and 20 characters');

    if (ctx.errors) throw new BadRequest(ctx.errors);
    let search = {
        username: ctx.request.body.username,
        password: string.generatePasswordHash(ctx.request.body.password),
    }
    const user = await User.findOne(search);

    if (!user){ 
        throw new Unauthorized('无效凭据')
    }else{
        let token  = jwt.encode({id:user.id});
         ctx.body = {
        id: user.id,
        username: user.username,
        token: token,
    };
    //根据token获取操作人id
    let userid = user.id
     //获取用户名
    let row = await User.findById(userid);
     //往日志表里添加数据
    let logData ={method:'post',requestUrl:'/api/login',operator:row.username+'登录',body:JSON.stringify(search)}
    let logRes = await Logger.insert(logData);
    return token;
    };
});

module.exports = router;
