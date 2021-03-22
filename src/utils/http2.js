import config from '../config/api'

class HttpHelper {
  constructor() {
    this.xhr = new XMLHttpRequest()
    this.baseUrl = config.BASE_API
    this.methodType = {
      GET: 'GET',
      POST: 'POST',
      DELETE: 'DELETE',
      PUT: 'PUT',
    }
  }

  /**
   * get请求
   * @param url
   * @param params
   */
  get(url, params) {
    return this.__request(this.methodType.GET, this.__formatUrlForQuery(url, params))
  }

  post(url, data) {
    let _data = data
    if (
      Object.prototype.toString.call(_data) === '[object Object]' &&
      Object.keys(_data).length >= 0
    ) {
      _data = JSON.stringify(_data)
    }

    return this.__request(this.methodType.POST, this.__apendUrl(url), _data)
  }

  delete(url, params) {
    return this.__request(this.methodType.PUT, this.__formatUrlForQuery(url, params))
  }

  put(url, data) {
    return this.__request(
      this.methodType.PUT,
      this.__apendUrl(url),
      JSON.stringify(data),
    )
  }

  __request(method, url, data = null) {
    return new Promise((resolve, reject) => {
      this.xhr.open(method, url)
      data &&
        this.xhr.setRequestHeader(
          'Content-type',
          'application/x-www-form-urlencoded',
        )
      this.xhr.send(data)
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          const statusCode = this.xhr.status
          if (statusCode.toString().startsWith('2')) {
            // 2xx
            const data = JSON.parse(this.xhr.responseText)
            resolve(data)
          } else {
            // 4xx,5xx
            reject('请求失败')
          }
        }
      }
    })
  }

  /** 请求参数转query */
  __formatUrlForQuery(url, params) {
    let _url = this.__apendUrl(url)
    if (Object.prototype.toString.call(params) === '[object Object]') {
      for (const key in params) {
        _url += '&' + key + '=' + params[key]
      }
    }
    if (Object.prototype.toString.call(params) === '[objct String]') {
      // TODO 参数纯字符,则不处理,此处未来可能有需求
    }
    return _url
  }

  /** 基础url拼接 */
  __apendUrl(url) {
    return process.env.NODE_ENV === 'production'
      ? config.BASE_API + url + '?key=' + config.APIKEY
      : url + '?key=' + config.APIKEY
  }
}

export default new HttpHelper()
