// const router = require('../../lib/auth-router');
const router = require('../../lib/router');

const knex = require('../../lib/knex');
//测试接口
router.post('/sys/test', async ctx =>{
   
//    console.log(list);
   ctx.body={"message":"sys........"};
    //  knex.migrate.make('ts_demo2')//创建更新
    //  let res=knex.migrate.latest();//更新所有
    //  let res= knex.migrate.rollback(true) // 回滚所有
    //  let res = knex.migrate.currentVersion()
    //  let res = knex.migrate.up()//运行尚未运行的下一个按时间顺序的迁移 每运行一次执行一次按时间顺序没执行的迁移
    //  knex.migrate.down();//回滚最新一次
    //  let res=knex.seed.make('ts_demo3');//创建种子文件 所谓种子文件 就是操纵表中的数据
    //  let res= knex.seed.run();//执行所有种子文件
    //  ctx.body=res;
})
/**
 * 接口地址 /api/sys/updateSys
 * 接口功能 更新系统数据库 更新所有迁移
 * 接口为私有的
 * 接口参数 无
 * 参数返回值 成功标志
 */
router.post('/sys/updateSys',async ctx =>{
    await knex.migrate.latest().then(()=>{
        knex.seed.run();
        ctx.body={'message':'更新成功！'};
    })
       
})
/**
 * 接口地址 /api/sys/rollbackSys
 * 接口功能 回滚系统数据库 回滚迁移
 * 接口为私有的
 * 接口参数 无 knex.migrate.rollback(true) // true 回滚所有 否则回滚最新一次
 * 参数返回值 成功标志
 */
router.post('/sys/rollbackSys',async ctx =>{
    await knex.migrate.rollback(true).then(()=>{
        ctx.body={'message':'回滚成功！'};
    });
})
/**
 * 接口地址 /api/sys/makeSys
 * 接口功能 创建migrations 迁移
 * 接口为私有的
 * 接口参数 ctx.request.body 例：{tableName:'ts_demo'}
 * 参数返回值 成功标志
 */
router.post('/sys/makeSys',async ctx =>{
    //创建更新迁移后 在创建种子文件
   await knex.migrate.make(ctx.request.body.tableName).then(()=>{
        knex.seed.make(ctx.request.body.tableName);
        ctx.body={'message':'创建成功！'}
    })
})
/**
 * 接口地址 /api/sys/updateNext
 * 接口功能 更新未执行的下一 迁移
 * 接口为私有的
 * 接口参数 无
 * 参数返回值 成功标志
 */
router.post('/sys/updateNext', async ctx =>{
    await knex.migrate.up().then(()=>{
        knex.seed.run();
        ctx.body={'message':'更新成功！'}
    })
})
/**
 * 接口地址 /api/sys/rollbackDown
 * 接口功能 回滚最近一次更新
 * 接口为私有的
 * 接口参数 无
 * 参数返回值 成功标志
 */
router.post('/sys/rollbackDown', async ctx =>{
    knex.migrate.down().then(()=>{
        ctx.body={'message':'回滚成功！'}
    })
})
module.exports = router;