import HttpHelper from "../utils/http2";
import LocalStorageHelper from "../utils/localStorage";
import { setPageListFormat } from "../utils/utils";

class HomeModule extends HttpHelper {
    constructor() {
        super();
        this.CACHE_HISTORY_LIMIT_MAX = 10
        this.CACHE_HISTORY_KEY = "HOSTORY"
        this.CACHE_FOLLOW_KEY = "FOLLOW"
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

    /** 设置浏览记录缓存 */
    async setHistoryCache(key, value) {
        const result = LocalStorageHelper.getCacheItemByKey(this.CACHE_HISTORY_KEY);
        if (!result) {
            const val = [value];
            LocalStorageHelper.setCacheItem(this.CACHE_HISTORY_KEY, val);
        } else {
            let index = -1;
            for (let i = 0; i < result.length; i++) {
                if (result[i]["uniquekey"] === key) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                result.unshift(value);
                if (result.length > this.CACHE_HISTORY_LIMIT_MAX) {
                    result.pop();
                }
                LocalStorageHelper.setCacheItem(this.CACHE_HISTORY_KEY, result);
            } else {
                [result[0], result[index]] = [result[index], result[0]];
                LocalStorageHelper.setCacheItem(this.CACHE_HISTORY_KEY, result);
            }
        }
    }

    /** 取出当前准备查看的新闻 */
    async getCurrentNewDetail() {
        const result = LocalStorageHelper.getCacheItemByKey(this.CACHE_HISTORY_KEY);
        console.log("历史缓存记录 ", result);
        const res = result[0];
        if (res) {
            return res
        }
    }

    /**
     * 设置点赞/取消点赞
     * @param {*} uniquekey 
     */
    async setFollowRecord(uniquekey) {
        const index = await this.checkFollowRecord(uniquekey);
        console.log("-------------", index);
        const result = await LocalStorageHelper.getCacheItemByKey(this.CACHE_FOLLOW_KEY)||[];
        if (index === -1) {
            // 没记录,添加记录,为点赞操作
            LocalStorageHelper.setCacheItem(this.CACHE_FOLLOW_KEY, [uniquekey, ...result]);
        } else {
            // 有记录则为取消点赞, 从缓存中移除掉该记录
            console.log(result);
            result.splice(index,1);
            console.log(result);
            LocalStorageHelper.setCacheItem(this.CACHE_FOLLOW_KEY, result);
        }
    }

    /**
     * 获取uniquekey的点赞情况
     * -1: 没有记录-可以点赞 
     * !=-1: 有记录-可以取消点赞
     * @param {*} uniquekey 
     */
     async checkFollowRecord(uniquekey) {
        const result = LocalStorageHelper.getCacheItemByKey(this.CACHE_FOLLOW_KEY) || [];
        console.log(result, " >>>>>>>>>>>>>>>");
        const index = result.indexOf(uniquekey);
        return index
    }
}

export default new HomeModule();
