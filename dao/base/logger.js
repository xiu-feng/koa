const Crud = require('../crud')
const table_name = 't_base_logger';

/**
 * 如要添加自定义的方法 格式如下
 */
// const knex = require('../../lib/knex');
// crud.aaa = async (参数)=> {
//   // db...
// }
const crud = Crud(table_name)

module.exports = crud
