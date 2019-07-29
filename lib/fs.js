const fs = require('fs');
const path = require('path');

exports.listSubDirctories = (dir) => {
  // console.log("dir:", dir)
  const list = fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory())
  // console.log("list:", list)
  return list
} 

exports.listSubFiles = (dir) => {
  // console.log("dir:", dir)
  const list = fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isFile())
  // console.log("list:", list)
  return list
}
// // set routes
// fs.readdirSync('./app').filter(file => fs.statSync(path.join('./app', file)).isDirectory()).forEach((moduleName) => {
//     fs.readdirSync(`./app/${moduleName}`).filter(file => fs.statSync(path.join(`./app/${moduleName}`, file)).isFile()).forEach((route) => {
//         app.use(require(`./app/${moduleName}/${route}`).routes());
//     });
// });
