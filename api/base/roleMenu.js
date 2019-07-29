const router = require('../../lib/auth-router');
const roleMenu = require('../../dao/base/role-menu');
const Restful = require('../restful')
const resource = 'rolemenu'
/**
 * 配置用户角色模块
 */
/**
 * 接口路径 /api/roleMenu/delafinsert
 * 接口功能 根据用户id先删后增
 * 接口为私有的
 * 接口参数 新增的数据 角色id rid只能为一个 mid 可以为多个  示例 ctx.request.body中的参数格式为{mid:[1,2,3],rid:1}
 * 接口返回值 成功标志
 */
Restful.delafinsert =router.post('/roleMenu/delafinsert',async ctx =>{
    let mid = ctx.request.body.mid;
    let rid = ctx.request.body.rid;
    let data;
    let list = await roleMenu.getlist({rid:rid});
    let res='';
    if(list.length!=0){
        res  = await roleMenu.del({rid:rid});
        if(res){
            for(var i = 0;i<mid.length;i++){
                data = {mid:mid[i],rid:rid}
                res = await roleMenu.insert(data);
            }
       }
    }else{
        for(var i = 0;i<mid.length;i++){
            data = {mid:mid[i],rid:rid}
            res = await roleMenu.insert(data);
        }
    }
    ctx.body=res;
    return res;
})

const restful = Restful(resource, roleMenu)

module.exports = Restful;