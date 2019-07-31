const authRouter = require('../lib/auth-router')
const publicRouter = require('../lib/router')

function parseQuery(query) {
  let where = {}
  let {sort, page, perpage} = query
  const keywords = ['page', 'perpage', 'sort']
  //遍历对象的key
  for(const k in query) {
    if(keywords.indexOf(k) < 0) {//查看在关键字里面出现的下标 小于0代表没有
      where[k] = query[k] //将字段的值放入where条件
    }
  }
  // 对sort进行排序转译
  if (sort) {
    sort = sort.split(',').map(s => {
      if (s[0] == '>') {
        return {
          name: s.substr(1),
          type: 'asc'
        }
      } else if (s[0] == '<') {
        return {
          name: s.substr(1),
          type: 'desc'
        }
      } else {
        throw new Error('Invalid sort indicator! (">" or "<" only)')
      }
    })
  }

  return {
    where,
    opt: {
      sort,
      page,
      perpage
    }
  }
}

const Restful = function(resource, dao) {

  /**按除id的其余字段获取 例 /api/user?foo=bar 
   * 注意：尽量少用
   * 参数 条件 json类型 参数值不能加双引号 参数为空默认获取所有
   * 返回值 json数组
   */	
  publicRouter.get('/' + resource, async ctx =>{
    let q = parseQuery(ctx.query);
    let list = await dao.list(q.where || {}, q.opt);
    ctx.body = list;
    return list;
  }),
  /**
   * 接口作用：根据id获取数据
   * 参数 id 字符串类型
   * 返回值 json串
   */
  publicRouter.get('/' + resource + '/:id', async ctx =>{
    let id = ctx.params.id;
    let row = await dao.findById(id);
    ctx.body = row;
    return row;
  }),
  
  /**
   * 接口作用：添加数据
   * 参数：json数据
   * 返回值 标志
   */
  authRouter.post('/' + resource, async ctx =>{
    let data = ctx.request.body;
    let res = await dao.insert(data);
    ctx.body=res;
    return res;
  }),
  
  /**
   * 接口作用：根据id修改
   * 参数：id json串类型 data 需要修改的数据 json串格式
   * 返回值 标志
   */
  authRouter.put('/' + resource + '/:id', async ctx =>{
    let id =ctx.params;
    let data = ctx.request.body;
    let res = await dao.update(id,data);
    ctx.body = res;
    return res; 
  }),
  /**
   * 接口作用：根据query查询，修改一个用户
   * 参数 where query参数 data 需要修改的数据
   * 返回值 标志 
   */
  
  /**
   * 接口作用：按id删除数据
   * 参数 id json串
   * 返回值 标志
   */
  authRouter.delete('/' + resource +'/:id', async ctx =>{
    let id = ctx.params;
    let res = await dao.del(id);
    ctx.body = res;
    return res;
  })
  /**
   * 接口作用：按id修改字段数据
   * 参数 id params参数 data request.body参数
   * 返回值 标志
   */
  authRouter.patch('/' + resource +'/:id', async ctx =>{
    let id = ctx.params;
    let data = ctx.request.body;
    let res = await dao.update(id,data);
    ctx.body = res;
    return res;
  })
  return {
    authRouter,
    publicRouter
  }
}

module.exports = Restful
