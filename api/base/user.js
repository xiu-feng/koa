const router = require('../../lib/auth-router');
const User = require('../../dao/base/user');
const userRole = require('../../dao/base/user-role');
const string = require('../../lib/string');
const Restful = require('../restful')
const resource = 'user'
/**
 * 接口地址 /api/user/insert
 * 接口功能 添加用户数据
 * 接口为私有的
 * 接口参数 表单提交数据{"username":"ceshi2","password":"123456"} data为sql中的添加数据
 * 接口返回值 {message:添加成功} 表示成功
 */
Restful.insert = router.post('/' + resource, async (ctx) =>{
    //对密码进行加密
    let password = string.generatePasswordHash(ctx.request.body.password);
    let username = ctx.request.body.username;
    let row = await User.findOne({username:username});
    console.log('row:',!row);
    if (!row) {
        let data = {username:ctx.request.body.username,password:password};
        let res = await User.insert(data);
        ctx.body=res;
        return res;
    }else{
        ctx.body = {message:'用户已存在！'};
        return {message:'用户已存在！'};
    }
    
});
/**
* 接口地址 /api/user/1/update
 * 接口功能 根据条件修改status状态值
 * 接口为私有的
 * 接口参数 {username:'11111'} where 条件 data 要修改的 字段与值
 * 接口返回值 json
 */
Restful.update = router.put('/' + resource + '/:id',async (ctx) =>{
    let data = ctx.request.body;
    let where = ctx.params;
    let status;
    let dataps;
    let row = await User.findOne(where);
    if(row.username==ctx.request.body.username){
        status = await User.update(where,data);
        if(ctx.request.body.password){
            dataps  ={password:string.generatePasswordHash(ctx.request.body.password)};
            await User.update(where,dataps);
        }
    }else{
        if(ctx.request.body.username){
            let row = await User.findOne({username:ctx.request.body.username});
            if (!row) {
                status = await User.update(where,data);
                if(ctx.request.body.password){
                    dataps  = {password:string.generatePasswordHash(ctx.request.body.password)};
                    await User.update(where,dataps);
                } 
            }else{
                status = {'message':'用户已存在'}
            }
        }else{
            status = await User.update(where,data);
            if(ctx.request.body.password){
                dataps  ={password:string.generatePasswordHash(ctx.request.body.password)};
                await User.update(where,dataps);
            }
        }
    }
    ctx.body = status;
    return status;
})
/**
* 接口地址 /api/user/1/del
 * 接口功能 根据id删除 ，删除时将用户-角色表中的对应数据也删除
 * 接口为私有的
 * 接口参数 {id:'11111'} where 条件 
 * 接口返回值 json 
 */
Restful.del = router.delete('/' + resource + '/:id',async (ctx) =>{
    let where = ctx.params;
    let uid = {uid:ctx.params.id};
    let list = await userRole.list(uid);
    let status;
    if(list.length!=0){
        let res = await userRole.del(uid);
        if(res.message=='删除成功！'){
            status = await User.del(where);
       }
    }else{
        status = await User.del(where);
    }
    ctx.body =status;
    return status;
})
// module.exports = router.routes();

const restful = Restful(resource, User)
module.exports = Restful;
