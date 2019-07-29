
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return  knex('T_base_user').del()
    .then(function () {
      // Inserts seed entries
      return knex('T_base_user').insert([
        {id:1,username: 'admin',password: '76b78bc2e5a0ddab3ca480b1ffb83880d4aeaab5',status: 1}
      ]);
    }),
    knex('T_base_role').del()
    .then(function (){
      return knex('T_base_role').insert([
        {id:1,name:'测试11'}
      ])
    }),
    knex('T_base_menu').del()
    .then(function (){
      return knex('T_base_menu').insert([
        {id:1,menu_name:'ceshi1',parentId:0,isparentId:0},
        {id:2,menu_name:'ceshi11',parentId:1,isparentId:0},
        {id:3,menu_name:'ceshi111',parentId:2,isparentId:1},
        {id:4,menu_name:'ceshi2',parentId:0,isparentId:0}
      ])
    }),
    knex('T_base_user_role').del()
    .then(function (){
      return knex('T_base_user_role').insert([
        {uid:1,rid:1}
      ])
    }),knex('T_base_role_menu').del()
    .then(function (){
      return knex('T_base_role_menu').insert([
        {rid:1,mid:1},
        {rid:1,mid:2},
        {rid:1,mid:3},
        {rid:1,mid:4}
      ])
    })
};
