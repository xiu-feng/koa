const router = require('../../lib/auth-router');
const User = require('../../dao/base/user');
const userRole = require('../../dao/base/user-role');
const string = require('../../lib/string');
const jwt = require('../../lib/jwt');
const Restful = require('../restful')
const Logger = require('../../dao/base/logger')
const resource = 'user'
/**
 * 接口地址 /api/user
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
         //根据token获取操作人id
        let userid = jwt.decode(ctx.request.header.token).id;
         //获取用户名
        let row = await User.findById(userid);
         //往日志表里添加数据
        let logData ={method:'post',requestUrl:'/api/'+resource,operator:row.username,body:JSON.stringify(data)}
        let logRes = await Logger.insert(logData);
        ctx.body=res;
        return res;
    }else{
        ctx.body = {message:'用户已存在！'};
        return {message:'用户已存在！'};
    }
    
});
/**
* 接口地址 /api/user/1
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
        if(ctx.request.body.password){
            dataps  ={username:ctx.request.body.username,password:string.generatePasswordHash(ctx.request.body.password)};
            await User.update(where,dataps);
            //根据token获取操作人id
            let userid = jwt.decode(ctx.request.header.token).id;
            //获取用户名
            let row = await User.findById(userid);
            //往日志表里添加数据
            let logData ={method:'put',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,body:JSON.stringify(dataps),params:JSON.stringify(where)}
            let logRes = await Logger.insert(logData);
        }else{
            status = await User.update(where,data);
            //根据token获取操作人id
            let userid = jwt.decode(ctx.request.header.token).id;
            //获取用户名
            let row = await User.findById(userid);
            //往日志表里添加数据
            let logData ={method:'put',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,body:JSON.stringify(data),params:JSON.stringify(where)}
            let logRes = await Logger.insert(logData);
        }
    }else{
        if(ctx.request.body.username){
            let row = await User.findOne({username:ctx.request.body.username});
            if (!row) {
                if(ctx.request.body.password){
                    dataps  ={username:ctx.request.body.username,password:string.generatePasswordHash(ctx.request.body.password)};
                    await User.update(where,dataps);
                    //根据token获取操作人id
                    let userid = jwt.decode(ctx.request.header.token).id;
                    //获取用户名
                    let row = await User.findById(userid);
                    //往日志表里添加数据
                    let logData ={method:'put',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,body:JSON.stringify(dataps),params:JSON.stringify(where)}
                    let logRes = await Logger.insert(logData);
                }else{
                    status = await User.update(where,data);
                    //根据token获取操作人id
                    let userid = jwt.decode(ctx.request.header.token).id;
                    //获取用户名
                    let row = await User.findById(userid);
                    //往日志表里添加数据
                    let logData ={method:'put',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,body:JSON.stringify(data),params:JSON.stringify(where)}
                    let logRes = await Logger.insert(logData);
                } 
            }else{
                status = {'message':'用户已存在'}
            }
        }else{
            if(ctx.request.body.password){
                dataps  ={username:ctx.request.body.username,password:string.generatePasswordHash(ctx.request.body.password)};
                await User.update(where,dataps);
                 //根据token获取操作人id
                 let userid = jwt.decode(ctx.request.header.token).id;
                 //获取用户名
                 let row = await User.findById(userid);
                 //往日志表里添加数据
                 let logData ={method:'put',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,body:JSON.stringify(dataps),params:JSON.stringify(where)}
                 let logRes = await Logger.insert(logData);
            }else{
                status = await User.update(where,data);
                //根据token获取操作人id
                let userid = jwt.decode(ctx.request.header.token).id;
                //获取用户名
                let row = await User.findById(userid);
                //往日志表里添加数据
                let logData ={method:'put',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,body:JSON.stringify(data),params:JSON.stringify(where)}
                let logRes = await Logger.insert(logData);
            }
        }
    }
    ctx.body = status;
    return status;
})
/**
* 接口地址 /api/user/1
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
            //根据token获取操作人id
            let userid = jwt.decode(ctx.request.header.token).id;
            //获取用户名
            let row = await User.findById(userid);
            //往日志表里添加数据
            let logData ={method:'delete',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,params:JSON.stringify(where)}
            let logRes = await Logger.insert(logData);
       }
    }else{
        status = await User.del(where);
        //根据token获取操作人id
        let userid = jwt.decode(ctx.request.header.token).id;
        //获取用户名
        let row = await User.findById(userid);
        //往日志表里添加数据
        let logData ={method:'delete',requestUrl:'/api/'+resource+'/'+where.id,operator:row.username,params:JSON.stringify(where)}
        let logRes = await Logger.insert(logData);
    }
    ctx.body =status;
    return status;
})
// module.exports = router.routes();

const restful = Restful(resource, User)
module.exports = Restful;
