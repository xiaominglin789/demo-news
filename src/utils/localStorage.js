import cacheConf from "../config/cache";

class LocalStorageHelper {
    constructor() {
        if(typeof(Storage) === "undefined") {
            // 不不支持
            throw new Error("警告: 当前浏览器 或 webview 不支持 localStorage 缓存.")
        }
    }

    /**
     * 设置缓存
     * @param {*} key 键名
     * @param {*} value 数据
     * @param {*} config 可选, 其他配置，用于设置具有时效的缓存: { startTime: 0, expires: 0 }
     * @returns 
     */
    setCacheItem(key, value, config) {
        if (!key || !value ) return;

        const realKey = this.__getKey(key);
        
        const cacheVal = { cache:value };

        if (typeof config === "object" && config != null) {
            cacheVal.startTime = config.startTime
            cacheVal.expires = config.expires
        }

        // TODO
        console.log("cacheVal: ", cacheVal);

        try {
            localStorage.setItem(realKey, JSON.stringify(cacheVal));
        } catch (error) {
            throw new Error("本地缓存失败,请检查本地内存情况.");
        }
    }

    /**
     * 设置具有时效的缓存
     * @param {*} key 
     * @param {*} value 
     * @param {*} expires 过期时间,单位： ms, 默认: 0
     */
    setCacheItemWithExpires(key, value, expires = 0) {
        if (expires <= 0) {
            // 没有设置过期时间, 那么走永久缓存
            return this.setCacheItem(key, { cache: value });
        }

        const startTime = new Date().getTime();
        const config = {
            startTime,
            expires,
        }
        this.setCacheItem(key, value, config);
    }

    /**
     * 取缓存
     * @param {*} key 
     * @returns null 或者 数据
     */
    getCacheItemByKey(key) {
        if (!key) return;

        const realKey = this.__getKey(key);
        let val = localStorage.getItem(realKey) || null;
        
        try {
            val = JSON.parse(val);
        } catch (error) {
            console.log("getCacheItemByKey - JSON.parse Error: ", error)
        }

        if (!val) { return; }
        
        console.log("获取缓存数据: key = ", key, " value = ", val.cache);

        // 是否有时间参数, 判断过期时间, 如果过期则返回空
        const startTime = val.startTime || 0;
        if (startTime === 0) { return val.cache }

        const expires = val.expires;
        const isExprires = startTime + expires > new Date().getTime() ? true : false;
        if (isExprires) {
            return val.cache;
        } else {
            console.log("缓存数据已过期!: key = ", key, " value = ", val.cache);
            return;
        }
    }

    /**
     * 移除某个key的缓存
     * @param {*} key 
     */
    removeItemByKey(key) {
        if (!key) return;

        const realKey = this.__getKey(key);
        return localStorage.removeItem(realKey);
    }

    /** 清理 带时间的 时效的缓存记录 */
    clearHasExpiredCache() {
        const allCaches = window.localStorage;
        if (allCaches.length <= 0) { return; }
        
        // 找出有时效的缓存, 判断检测缓存的有效性, 失效则清空该记录
        for (let i=0; i < allCaches.length; i++) {
            const tmpKey = allCaches.key(i).replace(cacheConf.APP_CACHE_PREFIX, "");
            const result = this.getCacheItemByKey(tmpKey);
            if (!result) {
                // 空则 清空此记录
                this.removeItemByKey(tmpKey);
            }
        }
    }

    /** 清空域下-所有缓存 */
    clearAllCache() {
        localStorage.clear();
    }

    /**
     * 生成实际的规则 cache-key 
     * 未来生成hash-key
     * @param {String} key 
     * @returns 
     */
    __getKey(key) {
        // console.log(String(key).toLocaleUpperCase());
        return cacheConf.APP_CACHE_PREFIX + String(key).toLocaleUpperCase();
    }
}

export default new LocalStorageHelper();
