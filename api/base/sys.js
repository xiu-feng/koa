// const router = require('../../lib/auth-router');
const router = require('../../lib/router');
const fs = require('fs');

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


function find(str,cha,num){
    var x=str.indexOf(cha);
    for(var i=0;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}


/**
 * 接口地址 /api/sys/tables
 * 接口功能 根据表名自动生成接口
 * 接口为公有的
 * 接口参数 无
 * 参数返回值 无
 */
router.get('/sys/tables', async ctx =>{
    let list = await knex.schema.raw('show tables')
    let tables = list[0];
    let tableList=[];
    
    tableList = tables.map(e => {
        return Object.values(e)[0]
    }).filter(e => {
        return !e.startsWith('knex_')
    })

    console.log('.......',tableList);
    fs.mkdir('api/generator',error =>{
        if(error){
            console.log(error);
            return false;
        }
        console.log('创建api目录成功');    
    })

    fs.mkdir('dao/generator',error =>{
        if(error){
            console.log(error);
            return false;
        }
        console.log('创建dao目录成功');    
    })
   
    for(var j =0;j<tableList.length;j++){
        console.log(tableList[j]);
        let k = find(tableList[j],'_',1)
        let table =tableList[j].substring(k+1);

        let generatorrestful = `
const Restful = require('../restful')
const dao = require('../../dao/generator/${table}');
const resource = '${table}'
/**
 * 封装外自定义方法 例
 */
// restful.aaa = async ctx =>{
//     Farm.aaa
// }
const restful = Restful(resource, dao)

module.exports = restful;`;
        let generatordao = `
const Crud = require('../crud')
const table_name = 'T_base_${table}';

const crud = Crud(table_name)

/**
 * 如要添加自定义的方法 格式如下
 */
// const knex = require('../../lib/knex');
// crud.aaa = async (参数)=> {
//   // db...
// }

module.exports = crud`;
        fs.writeFile(`api/generator/${table}.js`,generatorrestful,'utf-8',error =>{
        if(error){
            console.log(error);
            return false;
        }
        console.log(`写入api/generator/${table}.js成功`);
    })
    
    fs.writeFile(`dao/generator/${table}.js`,generatordao,'utf-8',error =>{
        if(error){
            console.log(error);
            return false;
        }
        console.log(`写入dao/generator/${table}.js成功`);
    })
    }
    ctx.body =list;
    return {'message':'生成成功！'};
})

module.exports = router;