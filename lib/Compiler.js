let path = require('path')
let fs = require('fs')
let babylon  = require('babylon')
let generator  = require('@babel/generator').default
let traverse  = require('@babel/traverse').default
let types  = require('@babel/types')
class Compiler {
  constructor(config) {
    this.config = config
    this.entryId = config.entry ;
    this.entry = config.entry;
    this.module = {};
    this.root = process.cwd();
    this.run()
  }
  // 获取资源
  getSource(modulePath) {
    let source = fs.readFileSync(modulePath, 'utf8')
    return source;
  }
  // 解析源码
  parse(source, parentName) {
    let sourceCode = ''
    let dependencies = []
    let ast = babylon.parse(source)
    traverse(ast, {
      CallExpression(p) {
        let node = p.node;
        if(node.callee.name === 'require') {
          node.callee.name = '_webpack_require_';
          let moduleName = node.arguments[0].value; // 取到模块引用的名字
          moduleName = moduleName + (path.extname(moduleName)? '' : '.js'); // 判断文件名称是否有后缀名 没有加上.js
          moduleName = './' + path.join(parentName, moduleName);
          dependencies.push(moduleName);
          console.log(parentName,types.stringLiteral.toString())
          node.arguments = [types.stringLiteral(moduleName)]
        }
      }
    })
    sourceCode = generator(ast).code
    return {
      sourceCode,
      dependencies
    }
  }
  // 构建模块
  buildModule (modulePath, isEntry) {
    let source = this.getSource(modulePath);
    console.log(this.root)
    let moduleName = './' + path.relative(this.root, modulePath)
    if(isEntry) {
      this.entryId = moduleName
    }
    // this.module[moduleName] 
    let { sourceCode,
      dependencies
    } = this.parse(source, path.dirname(moduleName));
    console.log(sourceCode, dependencies,moduleName)    
  }
  emitFile() {

  }
  run() {
    this.buildModule(path.resolve(this.root, this.entry), true); 
    this.emitFile();
  }
}
module.exports = Compiler