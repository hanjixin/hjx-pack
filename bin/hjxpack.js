#! /usr/bin/env node
// 1) 需要找到当前执行路径的  webpack.config.js 
let path = require('path');
let root = process.cwd();
let config  = require(path.resolve(process.cwd(), 'webpack.config.js'));
console.log(config)
let Compiler = require('../lib/Compiler.js');
let compiler = new Compiler(config)