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

/** window滚动条回到顶部 */
const windowScrollToTop = () => {
    // 时机控制: event-loop => dom渲染 > 微任务 > 宏任务
    setTimeout(() => {
        window.scrollTo(0, 0); // 搜索浏览器 不支持 scrollTo({...}) 的写法
    }, 0);
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
    while(index < len) {
        pageList.push(list.slice(index, (index + count)));
        index += count;
    }

    return pageList;
}

/**
 * 图片懒加载
 * @param {*} realImgDom 节点 
 * @param {*} imgUrl 图片地址
 */
const lazyImageLoader = (realImgDom, imgUrl) => {
    if (!imgUrl || !realImgDom) return;

    const imgVirtual = new Image();
    imgVirtual.src = imgUrl;
    
    imgVirtual.onload = () => {
        dom.src = imgVirtual.src;
    }
}

export {
    templateReplace,
    windowScrollToTop,
    setPageListFormat,
    lazyImageLoader,
}
