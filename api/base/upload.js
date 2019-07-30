const router = require('../../lib/router');
const fs = require('fs');
const path = require('path');


/**
 * 接口功能 上传文件
 * 参数 一个文件
 */
router.post('/uploadfile', async (ctx, next) => {
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath ='public/uploads/'+`${new Date().getTime()}`+`${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    return ctx.body = {"message":"上传成功！","name":`${new Date().getTime()}`+`${file.name}`};
  });
/**
 * 上传多个文件
 * 必须两个以上文件
 */
  router.post('/uploadfiles', async (ctx, next) => {
    // 上传多个文件
    const files = ctx.request.files.file; // 获取上传文件
    for (let file of files) {
      // 创建可读流
      const reader = fs.createReadStream(file.path);
      // 获取上传文件扩展名
      let filePath ='public/uploads/'+`${new Date().getTime()}`+`${file.name}`;
      // 创建可写流
      const upStream = fs.createWriteStream(filePath);
      // 可读流通过管道写入可写流
      reader.pipe(upStream);
    }
   return ctx.body = ctx.body = {"message":"上传成功！"};
  });

  module.exports = router;