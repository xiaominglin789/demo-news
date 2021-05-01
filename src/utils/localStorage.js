import cache from "../config/cache";

class LocalStorageHelper {
    /**
     * 设置缓存
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    static setCacheItem(key, value) {
        if (!key || !value ) return;

        const realKey = LocalStorageHelper.__getKey(key);
        let val = value;
        if (typeof val === "object") {
            val = JSON.stringify(realKey, val);
        }
        try {
            localStorage.setItem(key, val);
        } catch (error) {
            throw new Error("本地缓存失败,请先清空下缓存");
        }
    }

    /**
     * 取缓存
     * @param {*} key 
     * @returns 
     */
    static getCacheItemByKey(key) {
        if (!key) return;

        const realKey = LocalStorageHelper.__getKey(key);
        let val = localStorage.getItem(realKey) || "";
        return JSON.parse(val);
    }

    /**
     * 移除某个key的缓存
     * @param {*} key 
     */
    static removeItemByKey(key) {
        if (!key) return;

        const realKey = LocalStorageHelper.__getKey(key);
        return localStorage.removeItem(realKey);
    }

    /** 清空域下-所有缓存 */
    static clearAllCache() {
        localStorage.clear();
    }

    /** 生成实际的规则 cache-key */
    static __getKey(key) {
        return cache.APP_CACHE_PREFIX + String(key).toLocaleUpperCase;
    }
}

export default LocalStorageHelper;
