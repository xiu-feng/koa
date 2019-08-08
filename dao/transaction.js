const knex = require('../lib/knex')

/**
 * 事务两表操作，可自定义添加
 */
const Transaction = function() {
  return{

    insert:async(table1,table2,data1,data2)=>{
      const trx = await knex.transaction();

      trx(table1)
        .insert(data1)
        .then(()=> {
          return trx(table2).insert(data2);
        })
        .then(trx.commit)
        .catch(trx.rollback);  
    },

    update:async (table1,table2,where1,where2,data1,data2)=>{
      const trx = await knex.transaction();

      trx(table1)
        .where(where1)
        .update(data1)
        .then(()=> {
          return trx(table2).where(where2).update(data2);
        })
        .then(trx.commit)
        .catch(trx.rollback);  
    },

    delete: async (table1,table2,where1,where2) =>{
      const trx = await knex.transaction();

      trx(table1)
        .where(where1)
        .del()
        .then(()=> {
          return trx(table2).where(where2).del();
        })
        .then(trx.commit)
        .catch(trx.rollback);  
    }

  }
}
  module.exports = Transaction 