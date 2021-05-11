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



## 图片懒加载+图片预加载 - 不成熟的方案
```javascript
/**
 * 滚动可见区域,才显示图片
 */
showListImg(clientViewHeight) {
    if (!clientViewHeight) { 
        clientViewHeight = window.innerHeight || 
            document.body.clientWidth || 
            document.documentElement.clientHeight
    }

    const imgsDom = document.querySelectorAll(".list-img");
    // 监听可见区域, 控制 imgsDom 的 opacity 即可
    [...imgsDom].forEach((child) => {
        // 图片可视边界
        const curRect = child.getBoundingClientRect();
        if (curRect.top < clientViewHeight && curRect.bottom > 0) {
            // 满足可视区域内才加载对应的图片
            const temp = new Image();
            temp.src = child.dataset.img;
            temp.onload = () => {
                child.src = temp.src;
            }
        }
    })
}
```




## 图片懒加载 - 常规做法
```javascript
imageLazyLoad(clientViewHeight) {
    if (!clientViewHeight) { 
        // 没传入,重新取可视高度
        clientViewHeight = getClientViewHeight();
    }

    const imgsDom = document.querySelectorAll("."+this.listItemImgClassName);
    let tempChild; // 临时变量
    let flagCount = 0; // 计数器
    for (let i=flagCount; i < imgsDom.length; i++) {
        tempChild = imgsDom[i];
        // 图片的距离顶部高度 小于 当前可视区的滚动距离 表示在可视区内
        if (tempChild.offsetTop < (clientViewHeight + getScrollTop())) {
            if (tempChild.getAttribute("data-img")) {
                tempChild.src = tempChild.getAttribute("data-img");
                // 移除 data-img 属性
                tempChild.removeAttribute("data-img");
                flagCount++;
            }
        }
    }
}
```





## 合理利用冒泡机制优化性能 - 避免: 创建过多的事件监听，对页面性能有影响
```bash
// 100列表项,每个项监听点击事件
<ul class="list">
  <li class="list-item" data-index="0">
  <li class="list-item active" data-index="1">
  ...
  <li class="list-item" data-index="99">
</ul>
const listChildren = document.querySelector(".list-item");
[...listChildren].forEach(child => {
    const index = child.dataset.index;
    child.addEventListener("click", (index) => {
        // do something
    }, false);
});


// 父容器-事件委托
const listParent = document.querySelector(".list");
listParent.addEventListener("click", () => {
    const target = arguments[0].target;
    if (target.className.splite(" ")[0].trim() === "list-item") {
        const index = target.dataset.index;
        // do something
    }
}, false);
```





## 使用数组模拟:队列 处理历史浏览,收藏列表(限制条数)
- Array.unshift(data) 在队首插入元素
- Array.pop() 移除队尾元素
```javascript
if (!has) {
    // 没有记录
    list.unshift(data);
    // 控制条数
    if (list.length > this.CACHE_FOLLOW_LIMIT_MAX) {
        list.pop();
    }
    LocalStorageHelper.setCacheItem(this.CACHE_FOLLOW_KEY, list);
}
```





## 函数限流防抖
```javascript
/**
 * 防抖函数
 * 1.是否首次延迟执行
 * 2.n秒频繁触发事件,计时器会频繁重新开始计时
 * @param {*} func 函数
 * @param {*} delay 延迟时间, 默认 300ms
 * @param {*} immediately 是否开启立刻执行一次函数, 默认 false
 * @returns 
 */
function debounce(func, delay = 300, immediately = false) {
    let timer = null;
    let result = null;
    // 检查函数
    if (typeof func !== 'function') {
        throw new TypeError('func not a function');
    }

    const debouncer = function () {
        const _this = this;
        const _args = arguments;

        if (timer) clearTimeout(timer);

        if (immediately) {
            // 立刻执行
            const exec = !timer;
            // 延迟操作
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            // 立刻执行函数
            if (exec) {
                result = func.apply(_this, _args);
            }
        } else {
            // 正常逻辑
            timer = setTimeout(() => {
                result = func.apply(_this, _args);
            }, delay);
        }
        return result;
    }

    return debouncer;
}

/**
 * 节流函数
 * @param {Function} func 函数
 * @param {Number} delay 延迟时间, 默认 300ms
 */
function throttle(func, delay = 300) {
    let timer;
    // 检查函数
    console.log(func);
    if (typeof func !== 'function') {
        throw new TypeError('func not a function');
    }
    return function () {
        let that = this;
        let args = arguments;

        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                func.apply(that, args);
            }, delay);
        }
    }
}
```






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
