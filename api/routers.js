// const compose = require('koa-compose')
const path = require('path')
const fs = require('../lib/fs')

const routerList = []
fs.listSubDirctories('./api').forEach(moduleName => {
  // console.log("moduleName:", moduleName)
  fs.listSubFiles(path.join('./api', moduleName)).forEach(route => {
    // console.log("route:", route)
    routerList.push(
      require(`./${moduleName}/${route}`)//.middle()
    )
  })
})

// console.log("routerList", routerList)
// const routes = compose.apply(null, routerList)

module.exports = routerList
