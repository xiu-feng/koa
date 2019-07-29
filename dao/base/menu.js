const Crud = require('../crud')
const knex = require('../../lib/knex');

const table_name = 'T_base_menu';

const crud = Crud(table_name)
/**
 * 根据用户名查询当前id下的子菜单,延时加载模块，每次点击都执行该方法
 */
crud.getlistbyuser = async (id,parentId) =>{
    let rid  =  knex('T_base_user_role').where(id).select('rid');
    let mid  =  knex('T_base_role_menu').where('rid','in',rid).select('mid');
    let list = await knex('T_base_menu').where('id','in',mid).andWhere('status','2').andWhere('parentId',parentId).select();
    return list ;
}
crud.getalllistbyuser = async (parentId) =>{
    let ids = await knex('T_base_menu').where(parentId)//.select('id');
    return ids ;
}

module.exports = crud

