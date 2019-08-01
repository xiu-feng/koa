const db = require('./sql');
const fs =require('fs')
const Crud = function(table) {
  return {
    /**
     * 新增数据
     * @param {*} ctx
     */
    insert: async (data)=>{
        let status =await db.insert(table,data);
        let insertseed =`
exports.seed = function(knex) {    
    return knex('${table}').insert([${JSON.stringify(data)}]);
};
 `
        if(table!='t_base_logger'){
            fs.writeFile(`seeds/insert_${table}_${new Date().getTime()}.js`,insertseed,'utf-8',error =>{
                if(error){
                    console.log(error);
                    return false;
                }
                console.log(`写入seeds/insert_${table}_${new Date().getTime()}.js成功`);
            })
        }
        return status;

    },
    /**
     * 修改数据
     * @param {*} data
     */
    update: async (where,data)=>{
        let status =await db.update(table,where,data);
        let updateseed =`
        exports.seed = function(knex) {    
            return knex('${table}').where(${JSON.stringify(where)}).update([${JSON.stringify(data)}]);
        };
         `
        fs.writeFile(`seeds/update_${table}_${new Date().getTime()}.js`,updateseed,'utf-8',error =>{
            if(error){
                console.log(error);
                return false;
            }
            console.log(`写入seeds/update_${table}_${new Date().getTime()}.js成功`);
        })
        return status;
    },

    /**
     * 删除数据
     * @param {*} data
     */
    del: async (where)=>{
        let status = await db.del(table,where);
        let delseed =`
        exports.seed = function(knex) {    
            return knex('${table}').where(${JSON.stringify(where)}).del();
        }; `
        fs.writeFile(`seeds/del_${table}_${new Date().getTime()}.js`,delseed,'utf-8',error =>{
            if(error){
                console.log(error);
                return false;
            }
            console.log(`写入seeds/del_${table}_${new Date().getTime()}.js成功`);
        })
        return status;
    },

    /**
     * 查询一条数据
     */
    findById: async (id) =>{
        let row = await db.findone(table,{id});
        return row;
    },

    /**
     * 查询一条数据
     */
    findOne:async (where) =>{
        let row = await db.findone(table,where);
        return row;
    },
    /**
     * 根据条件查询数据 where 条件 {username:username} ||{id:id}
     * where为空时返回所有数据
     */
    list: async (where,opt)=>{
        let list = await db.getList(table,where,opt);
        return list;
    }
  }
}

module.exports = Crud
