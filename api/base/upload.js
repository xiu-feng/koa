const authRouter = require('../../lib/auth-router')
const jwt = require('../../lib/jwt')
const User =require('../../dao/base/user')
const Logger =require('../../dao/base/logger')
const fs = require('fs');
const path = require('path');

authRouter.post('/uploadfile', async (ctx, next) => {
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath ='public/uploads/'+`${new Date().getTime()}`+`${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    let userid = jwt.decode(ctx.request.header.token).id;
    let row = await User.findById(userid);
    let logData ={method:'post',requestUrl:'/api/uploadfile',operator:row.username,body:filePath}
    let logRes = await Logger.insert(logData);
    return ctx.body = {"message":"上传成功！","name":`${new Date().getTime()}`+`${file.name}`};
  });
//最少2个文件
authRouter.post('/uploadfiles', async (ctx, next) => {
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
      let userid = jwt.decode(ctx.request.header.token).id;
      let row = await User.findById(userid);
      let logData ={method:'post',requestUrl:'/api/uploadfiles',operator:row.username,body:filePath}
      let logRes = await Logger.insert(logData);
    }
     
   return ctx.body = ctx.body = {"message":"上传成功！"};
  });

  module.exports = authRouter;