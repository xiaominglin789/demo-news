import HttpHelper from "../utils/http2";
import LocalStorageHelper from "../utils/localStorage";
import { setPageListFormat } from "../utils/utils";

class HomeModule extends HttpHelper {
    constructor() {
        super();
        this.CACHE_HISTORY_LIMIT_MAX = 10
        this.CACHE_HISTORY_KEY = "HOSTORY"

        this.CACHE_FOLLOW_KEY = "FOLLOW"
        this.CACHE_FOLLOW_LIMIT_MAX = 30
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
        const res = result[0];
        if (res) {
            return res
        }
    }

    /**
     * 设置点赞/取消点赞
     * @param {*} uniquekey 
     * @returns {Boolean} true: 设置成功, false: 设置失败
     */
    async setFollowRecord(data) {
        if (!data) return false;

        const { uniquekey } = data;
        console.log("uniquekey = ", uniquekey);
        const { index, has, list } = await this.checkFollowRecord(uniquekey);
        console.log("index = ", index, " has = ", has, " list = ", list);
        if (!has) {
            // 没记录,添加记录,为点赞操作
            list.unshift(data);
            if (list.length > this.CACHE_FOLLOW_LIMIT_MAX) {
                list.pop();
            }
            LocalStorageHelper.setCacheItem(this.CACHE_FOLLOW_KEY, list);
        } else {
            // 有记录则为取消点赞, 从缓存中移除掉该记录
            list.splice(index,1);
            console.log("修改后 list: ", list);
            LocalStorageHelper.setCacheItem(this.CACHE_FOLLOW_KEY, list);
        }
        return true;
    }

    /**
     * 获取uniquekey的点赞情况
     * @param {String} uniquekey 
     * @returns {Map} { 下标位置(index),  是否存在(has), 结果记录(record), 收藏记录列表(list) } || null
     */
    async checkFollowRecord(uniquekey) {
        if (!uniquekey) return;

        const result = LocalStorageHelper.getCacheItemByKey(this.CACHE_FOLLOW_KEY) || [];
        
        // reuslt => [{}]
        let index = -1;
        for (let i=0; i<result.length; i++) {
            if (uniquekey === result[i]['uniquekey']) {
                index = i;
                break;
            }
        }

        const has = index === -1 ? false : true;
        const record = !has ? null : result[index];
        return {index,  has, record, list: result };
    }
}

export default new HomeModule();
