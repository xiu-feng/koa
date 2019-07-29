const knex = require('../lib/knex');
//添加数据
const insert = async (table,data) =>{
    await knex(table)
            .insert(data);
    return {message:'添加成功！'};
}
  //根据条件更新数据
  const update = async (table, where, data) =>{
    await knex(table)
            .where(where)
            .update(data);
    return {message:'修改成功！'};
}

//根据条件删除
const del = async (table ,where) =>{
    let status= await knex(table)
            .where(where)
            .del();
    return {message:'删除成功！'};
}
//全部删除
const delall = async (table ) =>{
    let status= await knex(table)
            .del();
    return {message:'删除成功！'};
}
//获取列表 获取所有的列的所有的行记录 将where 赋值为{1=1} ，coum为'*'
const getList = async (table,where) =>{
    
    let list = await knex(table)
            .where(where)
            .select();
    return list;
}
//查询所有
const getallList = async (table) =>{
    let list = await knex(table)
            .select();
    return list;
}


//查找一条记录
const findone = async (table,where)=>{
    let row = await knex(table)
                    .where(where)
                    .first();
    return row;
}

//模糊查询
const getbylike= async(table,coum,like) =>{
    let list = await knex(table)
                        .where(coum,'like',"%"+like+"%");
    return list;
}
module.exports={
    insert,
    update,
    getList,
    getallList,
    getbylike,
    findone,
    del,
    delall
}