import config from '../config/api';

class HttpHelper {
  constructor() {
    this.xhr = new XMLHttpRequest();
    this.baseUrl = config.BASE_API;
    this.methodType = {
      GET: 'GET',
      POST: 'POST',
      DELETE: 'DELETE',
      PUT: 'PUT',
    };
  }

  /**
   * get请求
   * @param url
   * @param params
   */
  get(url, params) {
    return this.__request(this.methodType.GET, this.__formatUrlForQuery(url, params));
  }

  post(url, data) {
    let content = "";
    if (
      Object.prototype.toString.call(data) === '[object Object]' &&
      Object.keys(data).length >= 0
    ) {
      // 写入 第三方接口 key
      data['key'] = config.APIKEY;
      for (const key in data) {
        content += key + '=' + data[key] + '&';
      }
      content = content.substring(0, content.length-1);
    }

    url = process.env.NODE_ENV === 'production'
      ? config.BASE_API + url
      : config.BASE_API_DEV_FIX + url;

    return this.__request(this.methodType.POST, url, content);
  }

  delete(url, params) {
    return this.__request(this.methodType.PUT, this.__formatUrlForQuery(url, params));
  }

  put(url, data) {

    url = process.env.NODE_ENV === 'production'
      ? config.BASE_API + url
      : config.BASE_API_DEV_FIX + url;

    return this.__request(
      this.methodType.PUT,
      url,
      JSON.stringify(data),
    );
  }


  /**
   * 统一请求封装
   * @param {*} method 
   * @param {*} url 
   * @param {*} data 
   * @returns 
   */
  __request(method, url, data = null) {
    return new Promise((resolve, reject) => {
      this.xhr.open(method, url);
      
      data && this.xhr.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded',
      );

      this.xhr.send(data);
      // 响应处理
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          const statusCode = this.xhr.status;
          if (statusCode.toString().startsWith('2')) {
            // 2xx
            const data = JSON.parse(this.xhr.responseText);
            resolve(data);
          } else {
            // 4xx,5xx
            reject('请求失败');
          }
        }
      }
    })
  }

  /** 请求参数转query */
  __formatUrlForQuery(url, params) {
    let _url = this.__apendUrl(url);
    
    if (Object.prototype.toString.call(params) === '[object Object]') {
      for (const key in params) {
        _url += '&' + key + '=' + params[key];
      }
    }
    // if (Object.prototype.toString.call(params) === '[objct String]') {
    //   // TODO 参数纯字符,则不处理,此处未来可能有需求
    // }
    return _url;
  }

  /**
   * 基础url拼接 - 内部方法,会暴露第三方接口key
   * @param {*} url 
   * @returns 
   */
  __apendUrl(url) {
    return process.env.NODE_ENV === 'production'
      ? config.BASE_API + url + '?key=' + config.APIKEY
      : config.BASE_API_DEV_FIX + url + '?key=' + config.APIKEY
  }
}

export default HttpHelper;
