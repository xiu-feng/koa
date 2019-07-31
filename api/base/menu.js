const Restful = require('../restful')
const Menu =require('../../dao/base/menu');
const User = require('../../dao/base/user')
const jwt = require('../../lib/jwt');
const Logger = require('../../dao/base/logger')
const authRouter = require('../../lib/auth-router')
const resource = 'menu'
// const roleMenu = require('../../dao/base/role-menu');

/**
 * 接口地址 例 /api/menu/getlistbyuser?parentId=0&id=1
 * 接口作用 根据登录用户获取menu 延时加载类型 每次点击都只显示当前节点下的一级子节点
 * 接口为私有的
 * 接口参数 解析token中的数据，获取用户id 参数示例：parentId 数字 ?parentId=0&id=1
 * 接口返回值 菜单json数组  返回的是当前parentid 为 id值的数据
 */
Restful.getListByUser = authRouter.get('/'+ resource +'/getlistbyuser',async ctx =>{
    //第一步 根据token 获取用户id
    let id = {uid:ctx.query.id};
    let parentId = ctx.query.parentId || 0;
    let list = await Menu.getlistbyuser(id,parentId);
    ctx.body = list;
    return list;
})
/**
 * 根据父节点删除该父节点所有的子节点
 */
Restful.delTree = authRouter.delete('/' + resource +'/:id',async ctx =>{
    let id = ctx.params.id;
    let ids = await Menu.delTree(id);
     //根据token获取操作人id
    let userid = jwt.decode(ctx.request.header.token).id;
     //获取用户名
    let row = await User.findById(userid);
     //往日志表里添加数据
    let logData ={method:'delete',requestUrl:'/api/'+resource+'/'+id,operator:row.username,body:ids.toString()}
    let logRes = await Logger.insert(logData);
    let res ={'message':'删除成功'}
    ctx.body =res;
    return res;
})

/**
 * 接口地址 /api/menu/getalllistbyuser
 * 接口作用 根据登录用户获取menu 非延时加载类型 显示所有节点
 * 接口为私有的
 * 接口参数 解析token中的数据，获取用户id 参数示例：{parentId:0}
 * 接口返回值 菜单拼接的json数组  返回的是当前parentid 为 id值的数据 输出示例
 * [
    {
        "id": 129,
        "menuName": "ceshi111",
        "menuPath": null,
        "menuRemark": null,
        "parentId": 0,
        "status": 2,
        "iconCls": null,
        "sort": 0,
        "createtime": "2019-07-08T03:54:24.000Z",
        "isparent": 0,
        "children": [
            {
                "id": 130,
                "menuName": "ceshi2222",
                "menuPath": null,
                "menuRemark": null,
                "parentId": 129,
                "status": 2,
                "iconCls": null,
                "sort": 0,
                "createtime": "2019-07-09T06:23:40.000Z",
                "isparent": 0,
                "children": [
                    {
                        "id": 131,
                        "menuName": "csshi333",
                        "menuPath": null,
                        "menuRemark": null,
                        "parentId": 130,
                        "status": 2,
                        "iconCls": null,
                        "sort": 0,
                        "createtime": "2019-07-09T06:24:05.000Z",
                        "isparent": 1,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 132,
        "menuName": "ceshi444",
        "menuPath": null,
        "menuRemark": null,
        "parentId": 0,
        "status": 2,
        "iconCls": null,
        "sort": 0,
        "createtime": "2019-07-09T06:24:32.000Z",
        "isparent": 0,
        "children": []
    }
]
 */
Restful.getAllListByUser = authRouter.get('/'+ resource +'/getalllistbyuser',async ctx =>{
    //第一步 根据token 获取用户id
    let id = {uid:ctx.query.id}
    // console.log(username);
    // let row = await User.findOne({username:username});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    // console.log(row);
    // let id = {uid:row.id};
    let parentId = ctx.query.parentId || 0;
    //获取还用户下的权限根节点
    let list = await Menu.getlistbyuser(id,parentId);
    //将数据放入items 进行遍历
    let items = list;
    while(items.length!=0){//iteams为空时 结束
        //定义临时数组
        var nextLayer = [];
        for(var j = 0;j<items.length;j++){
            //获取items中的parent对象
            var parent = items[j];
            //查询该对象下的子节点
            let children = await Menu.getalllistbyuser({parentId: parent.id});
            //将子节点放入到parent对象的children属性中
            parent.children = children;
            //将children加入到nextLayer
            nextLayer = nextLayer.concat(children)
        }
        //将nextLayer赋值给items
        items = nextLayer
    }
    ctx.body = list;
    return list;
})

/**
 * 接口地址 /api/menu/listTree
 * 接口作用 根据登录用户获取menu 非延时加载类型 显示所有节点
 * 接口为私有的
 * 接口参数 解析token中的数据，获取用户id 参数示例：{parentId:0}
 * 接口返回值 菜单拼接的json数组  返回的是当前parentid 为 id值的数据 输出示例
 * [
    {
        "id": 129,
        "menuName": "ceshi111",
        "menuPath": null,
        "menuRemark": null,
        "parentId": 0,
        "status": 2,
        "iconCls": null,
        "sort": 0,
        "createtime": "2019-07-08T03:54:24.000Z",
        "isparent": 0,
        "children": [
            {
                "id": 130,
                "menuName": "ceshi2222",
                "menuPath": null,
                "menuRemark": null,
                "parentId": 129,
                "status": 2,
                "iconCls": null,
                "sort": 0,
                "createtime": "2019-07-09T06:23:40.000Z",
                "isparent": 0,
                "children": [
                    {
                        "id": 131,
                        "menuName": "csshi333",
                        "menuPath": null,
                        "menuRemark": null,
                        "parentId": 130,
                        "status": 2,
                        "iconCls": null,
                        "sort": 0,
                        "createtime": "2019-07-09T06:24:05.000Z",
                        "isparent": 1,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 132,
        "menuName": "ceshi444",
        "menuPath": null,
        "menuRemark": null,
        "parentId": 0,
        "status": 2,
        "iconCls": null,
        "sort": 0,
        "createtime": "2019-07-09T06:24:32.000Z",
        "isparent": 0,
        "children": []
    }
]
 */
Restful.listTree = authRouter.get('/'+ resource +'/listTree',async ctx =>{
    //第一步 根据token 获取用户id
    // console.log(username);
    // let row = await User.findOne({username:username});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    // console.log(row);
    // let id = {uid:row.id};
    let parentId = ctx.query.parentId || 0;
    //获取还用户下的权限根节点
    let list = await Menu.list({parentId:parentId});
    //将数据放入items 进行遍历
    let items = list;
    while(items.length!=0){//iteams为空时 结束
        //定义临时数组
        var nextLayer = [];
        for(var j = 0;j<items.length;j++){
            //获取items中的parent对象
            var parent = items[j];
            //查询该对象下的子节点
            let children = await Menu.list({parentId: parent.id});
            //将子节点放入到parent对象的children属性中
            parent.children = children;
            //将children加入到nextLayer
            nextLayer = nextLayer.concat(children)
        }
        //将nextLayer赋值给items
        items = nextLayer
    }
    ctx.body = list;
    return list;
})



const restful = Restful(resource, Menu)

module.exports = restful;
