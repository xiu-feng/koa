const Crud = require('../crud')
const knex = require('../../lib/knex');

const table_name = 't_base_menu';

const crud = Crud(table_name)
/**
 * 根据用户名查询当前id下的子菜单,延时加载模块，每次点击都执行该方法
 */
crud.getlistbyuser = async (id,parentId) =>{
    let rid  =  knex('t_base_user_role').where(id).select('rid');
    let mid  =  knex('t_base_role_menu').where('rid','in',rid).select('mid');
    let list = await knex('t_base_menu').where('id','in',mid).andWhere('status','2').andWhere('parentId',parentId).select();
    return list ;
}
crud.getalllistbyuser = async (parentId) =>{
    let ids = await knex('t_base_menu').where(parentId)//.select('id');
    return ids ;
}
crud.delTree = async(id) =>{
    let ids;
    let res = await knex.schema.raw(" SELECT id FROM (SELECT t1.id,IF (FIND_IN_SET(t1.parentId, @pids) > 0, @pids:= CONCAT(@pids, ',', t1.id), 0) AS ischild FROM  (SELECT t.id,t.parentId FROM t_base_menu t WHERE t.status = 2 ORDER BY t.parentId, t.id) t1, (SELECT @pids:="+id+" id) t2  ) t3 WHERE ischild != 0")
    ids = res[0].map(e => {
        return Object.values(e)[0]
    })
    ids.push(id);
    let result =await knex.schema.raw("DELETE FROM "+table_name+" WHERE id IN ("+ids+")")
    return ids;
}
module.exports = crud

