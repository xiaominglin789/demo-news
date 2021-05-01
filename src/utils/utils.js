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

export {
    templateReplace
}
