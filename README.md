## 前端工程化练习: 新闻资讯webapp
基于webpack4构建的工程化前端新闻资讯类webapp
- 优势: webpack4工程化构建





## 在线浏览地址





## 项目工程化 与 项目架构
- 1.项目工程化(开发版和线上版分离的方案)
    + 开发原则: 结构、样式、逻辑分离(html、css、js分离) => 分开-好维护(易读易改)
    + 开发版本(结构样式逻辑分离) --工程化打包(转化)--> 线上版本(减少资源http请求-内联主要css、内联主要js)
        - 线上版本: 性能、速度、效率
        - 开发版本: 结构、样式、逻辑分离
    + 工程化工具(webpack / vite): 
        - 1.css预处理(sass/less) 转 css
        - 2.es6+ 转 es5
        - 3.代码空格/注释/换行去掉 => 代码压缩
- 2.项目架构
    + 统一规范项目目录






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






## 识别 async、await语法, 使用`babel-plugin-transform-runtime`
```bash
# .babelrc
# 默认配置
{
    "plugins": [
        [
            "babel-plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": false, // false <=对应=> @babel/runtime
                "helpers": true,
                "regenerator": true,
                "useESModules": false, // babel转es5是不开启es6模块导包的
            }
        ]
    ]
}
```



## webpack + ejs 处理本地图片路径
前置知识: `/a/b/c.txt` => 绝对路径, `a/b/c.txt` => 相对路径
- 1.本地图片在 tpl 标签中的使用格式： <img src="<%= require('../../../assets/img/loading.gif') %>">
- 2.本地图片在 tpl 背景图中的使用格式： <div class="test" style="width:150px;height:90px;background: url(<%= require('../../../assets/img/loading.gif') %>) 50% 50% no-repeat;"></div>
- 3.webpack module-loader: url-loader 对资源文件打包的路径配置：
    + webpack 打包的所有资源都在 `dist/`下, 资源查找路径使用 `相对路径` 来找
    + img图片打包输出路径配置, 请直接在配置 filename 前加上路径,exp: `img/`
    + 本地图片资源将被打包到 `dist/img/*` 下.
```javascript
// `img/`
{
    test: /\.(png|jpg|jpeg|gif|ico|svg)$/i,
    use: [
        {
        loader: 'url-loader',
        options: {
            limit:1024 * 8, // 8k
            name:"img/[name]-[hash:16].[ext]",
            esModule: false,
        }
        },
        'image-webpack-loader',
    ],
},
// `font/`
{
    // 处理字体: font字体
    test: /\.(woff|woff2|eot|ttf)$/i,
    loader: 'url-loader',
    options: {
        name:"font/[name].[ext]",
    }
},
```
- 4.webpack plugin: miniCssExtractPlugin css 提取成单文件,输出的路径配置同理
```javascript
// `css/`
plugins: {
    new miniCssExtractPlugin({
      filename: isProductionMode
        ? 'css/[name]-[hash:16].css'
        : 'css/[name].css',
    }),
}
```



## 图片懒加载






## 函数限流






## 下载
```bash
git clone https://github.com/xiaominglin789/demo-news.git
```






## 安装依赖(依赖按照失败.请用换cnpm)
```bash
cd demo-news
npm install
or
cnpm install
```






## 调试
```bash
npm run dev
```






## 打包 => ./dist
```bash
npm run build
```
