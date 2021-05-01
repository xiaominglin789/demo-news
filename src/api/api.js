/** 项目请求管理 */
import HttpHelper from '../utils/http2';
import { NEWS_TYPE } from '../data';

/**
 * 获取新闻列表
 * @param {*} type 类型, 默认 top
 * @param {*} page 页数, 默认 1
 * @param {*} pageSize 条数, 默认 30
 * @returns 
 */
export const getNewsList = (type=NEWS_TYPE[0].name, page=1, pageSize=30) =>
  HttpHelper.get('/api/index', { type, page, page_size: pageSize });

/**
 * 根据 uniquekey字符串 获取新闻详情
 * @param {*} uniquekey uniquekey字符串 
 * @returns 
 */
export const getDetail = (uniquekey) => {
  if (uniquekey) { throw new Error('uniquekey 为必传参数.'); }

  return HttpHelper.post('/api/content', { uniquekey });
}
