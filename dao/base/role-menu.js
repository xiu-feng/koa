const Crud = require('../crud')
const table_name = 'T_base_role_menu';

// const knex = require('../common/knex');
/**
 * 配置用户时将选中的用户id和角色id添加到表中 采用根据用户id先删后增 一个用户可以有多个角色
 */
const crud = Crud(table_name)

module.exports = crud