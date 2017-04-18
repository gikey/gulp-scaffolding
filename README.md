# gulp-scaffolding

搭建demo项目脚手架工具

1.安装项目依赖

```bash
npm i
```

2. 创建demo项目

```bash
gulp --pro demo --type sass --open false 
```

参数都是可选(默认创建的项目目录为test, 使用css, 打开浏览器)

3.基本项目目录

```bash
.
├── bower_components
├── config.json
├── file.js
├── gulpfile.babel.js
├── node_modules
├── package.json
└── test
     ├── css
     │   └── style.css
     ├── index.html
     └── js
         └── index.js
```
