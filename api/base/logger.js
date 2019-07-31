
const Restful = require('../restful')
const Logger = require('../../dao/base/logger');
const resource = 'logger'
/**
 * 封装外自定义方法 例
 */
// restful.aaa = async ctx =>{
//     Farm.aaa
// }
const restful = Restful(resource, Logger)

module.exports = restful;