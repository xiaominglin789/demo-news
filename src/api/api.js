/** 项目请求管理 */
import HttpHelper from '../utils/http2'

// test
export const getHeader = (city = '北京') =>
  HttpHelper.get('/simpleWeather/query', { city: encodeURI(city) })
