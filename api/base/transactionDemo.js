const Restful = require('../restful')
const uuid =require('uuid/v4')
const Demo = require('../../dao/base/transactionDemo');
// const publicRouter = require('../../lib/router')
const authRouter =require('../../lib/auth-router')
const resource = 'demo'

Restful.insert = authRouter.post('/'+resource,async (ctx)=>{
    let cid = uuid();
    let table1 = 't_base_car'
    let table2 = 't_gis_last_location'
    let data1 = {code:'test112355',id:cid}
    let data2 = {cid:cid,license:'test12355'}
    let res = await Demo.transaction.insert(table1,table2,data1,data2)
    ctx.body = {'message':res+'12323'}
    return {'message':res}
})

Restful.update = authRouter.put('/'+resource +'/:id',async (ctx)=>{
    let where1 = ctx.params;
    let where2 = {cid:ctx.params.id};
    let table1 = 't_base_car'
    let table2 = 't_gis_last_location'
    let data1 = {code:'test8888'}
    let data2 = {license:'test8888'}
    let res = await Demo.transaction.update(table1,table2,where1,where2,data1,data2)
    ctx.body = {'message':res+'8888'}
    return {'message':res}
})

Restful.del = authRouter.delete('/'+resource + '/:id',async (ctx)=>{
    let where1 = ctx.params;
    let where2 = {cid:ctx.params.id};
    let table1 = 't_base_car'
    let table2 = 't_gis_last_location'
    let res = await Demo.transaction.delete(table1,table2,where1,where2)
    ctx.body = {'message':res+'4444'}
    return {'message':res}
})

const restful = Restful(resource, Demo)

module.exports = Restful;