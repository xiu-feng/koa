
exports.up = function(knex) {
    return knex.schema
    .createTable('T_base_user',t =>{
        t.increments('id').unsigned().primary()
        t.string('username').notNull()
        t.string('password').notNull()
        t.integer('status').notNull().defaultTo(0)
        t.timestamp('createtime').notNull().defaultTo(knex.fn.now())
    })
    .createTable('T_base_role',t =>{
        t.increments('id').unsigned().primary()
        t.string('name').notNull()
        t.string('remark')
        t.timestamp('createtime').notNull().defaultTo(knex.fn.now())
    })
    .createTable('T_base_menu',t =>{
        t.increments('id').unsigned().primary()
        t.string('menu_name').notNull()
        t.string('menu_path',2000)
        t.string('menu_remark')
        t.integer('parentId').notNull().defaultTo(0)
        t.integer('status').notNull().defaultTo(2)
        t.string('iconCls')
        t.integer('sort').notNull().defaultTo(0)
        t.timestamp('createtime').notNull().defaultTo(knex.fn.now())
        t.integer('isparentId').notNull().defaultTo(0)
    })
    .createTable('T_base_user_role',t =>{
        t.integer('uid').notNull()
        t.integer('rid').notNull()
    })
    .createTable('T_base_role_menu',t =>{
        t.integer('rid').notNull()
        t.integer('mid').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('T_base_user')
    .dropTable('T_base_role')
    .dropTable('T_base_menu')
    .dropTable('T_base_user_role')
    .dropTable('T_base_role_menu')
};
