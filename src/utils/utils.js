/**
 * 模版-变量替换
 * @param {*} template 模版
 * @param {*} options 需要替换变量的配置对象
 * @returns {String} 替换好的字符串
 */
const templateReplace = (template, options) => {
    if (!template || typeof template !== "function") { return; }

    if (!options || !Object.keys(options).length) { return template(); }

    return template().replace(/\{\{(.*?)\}\}/g, (node, key) => {
        return options[key.trim()];
    });
}

/**
 * window滚动条回到(x,y)处
 * @param {Number} x 纵坐标 默认 0
 * @param {Number} y 横坐标 默认 0
 * @param {Number} delay 延迟时间, 单位:ms 默认 0
 */
const windowScrollTo = (x = 0, y = 0, delay = 0) => {
    // 时机控制: event-loop => dom渲染 > 微任务 > 宏任务
    setTimeout(() => {
        window.scrollTo(x, y); // 搜索浏览器 不支持 scrollTo({...}) 的写法
    }, delay);
}

/**
 * 拆分聚合新闻接口每次请求的新闻列表数据
 * [..30] => [[..n],[..n],[..n]..]
 * @param {*} list 原数组
 * @param {*} count 每次拆分的个数
 * @returns {*} 拆解后的数组
 */
const setPageListFormat = (list, count) => {
    const len = list.length;
    let pageList = [];
    let index = 0;
    // 循环拆分
    while (index < len) {
        pageList.push(list.slice(index, (index + count)));
        index += count;
    }

    return pageList;
}

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

export {
    templateReplace,
    windowScrollTo,
    setPageListFormat,
    debounce,
    throttle,
}
