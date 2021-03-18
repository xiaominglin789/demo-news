## 前端工程化练习: 新闻资讯webapp
基于webpack4构建的工程化前端新闻资讯类webapp
- 优势: webpack4工程化构建


## 在线浏览地址



## 主要开发依赖
```bash
- postcss-loader / autoprefixer: 添加css兼容性前缀
- babel-core / babel-loader / babel-preset-latest: es6+ -> es5
- babel-plugin-transform-runtime: 配置.babelrc 支持async/await语法
- css-loader / style-loader: 处理css样式表(内嵌模式)
- html-loader / html-webpack-plugin: 处理html文件
- file-loader / url-loader: 处理文件资源(图片等)
- node-sass / sass-loader: 编译sass语法
- ejs / ejs-loader: 处理模板文件
- mini-css-extract-plugin: 单独提取css样式文件(与内嵌相反,抽离)
- uglifyjs-webpack-plugin: 压缩混淆js代码
- cross-env: 兼容所有平台动态设置NODE_ENV环境变量
- ** webpack 4 成功打包的版本记录 **
    - webpack 4.30.0
    - webpack-cli 3.3.0
    - webpack-dev-server 3.7.2
```


## 下载
git clone https://github.com/xiaominglin789/demo-news.git


## 调试
npm run dev
or
yarn dev


## 打包 => ./dist
npm run build
or 
yarn build
