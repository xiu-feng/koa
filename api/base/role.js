const Restful = require('../restful')
const Role =require('../../dao/base/role');
const resource = 'role'

const restful = Restful(resource, Role)
module.exports = Restful;