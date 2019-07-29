const router = require('../../lib/auth-router');
const userRole = require('../../dao/base/user-role');
const Restful = require('../restful')
const resource = 'userrole'
/**
 * 配置用户角色模块
 */
/**
 * 接口路径 /api/userRole/delafinsert
 * 接口功能 根据用户id先删后增
 * 接口为私有的
 * 接口参数 新增的数据 用户id uid只能为一个 rid 可以为多个  示例 ctx.request.body中的参数格式为{rid:[1,2,3],uid:1}
 * 接口返回值 成功标志
 */
Restful.delafinsert=router.post('/userRole/delafinsert',async ctx =>{
    let rid = ctx.request.body.rid;
    let uid = ctx.request.body.uid;
    let data;
    let list = await userRole.getlist({uid:uid});
    let res='';
    if(list.length!=0){
        res  = await userRole.del({uid:uid});
        if(res){
            for(var i = 0;i<rid.length;i++){
                data = {rid:rid[i],uid:uid}
                res = await userRole.insert(data);
            }
       }
    }else{
        for(var i = 0;i<rid.length;i++){
            data = {rid:rid[i],uid:uid}
            res = await userRole.insert(data);
        }
    }
    ctx.body=res;
    return res;
})

const restful = Restful(resource, userRole)

module.exports = Restful;