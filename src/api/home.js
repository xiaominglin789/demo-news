import HttpHelper from "../utils/http2";
import LocalStorageHelper from "../utils/localStorage";
import { setPageListFormat } from "../utils/utils";

class HomeModule extends HttpHelper {
    constructor() {
        super();
    }

    /**
     * 获取新闻列表
     * @param {String} type 类型, 默认 top
     * @param {Number} count 每次几条
     * @returns 
     */
    async getNewsList(type, count) {
        const has = LocalStorageHelper.getCacheItemByKey(type);
        if (has) {
            return Promise.resolve(has);
        }
        const res = await this.post("/index", { type });
        return new Promise((resolve, reject) => {
            if (res) {
                const pageData = setPageListFormat(res.result.data, count);
                LocalStorageHelper.setCacheItem(type, pageData);
                resolve(pageData);
            } else {
                reject(res);
            }
        });
    }
}

export default new HomeModule();
