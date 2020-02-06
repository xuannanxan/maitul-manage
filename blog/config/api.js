/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2020-02-06 20:25:48
 * @LastEditors  : Xuannan
 */
import {Method} from "../utils/http";
const Http = require('../utils/http');
let proxy = "http://127.0.0.1:5000/api"
let site = 'blog'
let blogBanner = '20200117223623299'
let blogRightAd = '20200117223636718'
let Api = {
  site:{site:site},
  webconfigUrl:proxy + '/webconfig' ,  //  站点配置接口
  categoryUrl:proxy+'/cms/blog/category',//博客分类
  contentUrl:proxy+'/cms/blog/content',//博客内容
  adUrl:proxy+'/resource/ad',//博客广告
  
}

export default Api;

// 博客分类
export const _category = async (formData={})=>{
  formData['site'] = site
  return await Http.request(Api.categoryUrl, Method.GET,formData)
};
// 博客内容列表 
export const _contentList = async (formData={})=>{
  formData['site'] = site
  return await Http.request(Api.contentUrl, Method.GET,formData)
};
// 博客banner
export const _banner = async (formData={})=>{
  formData['site'] = site
  formData['space_id'] = blogBanner
  return await Http.request(Api.adUrl, Method.GET,formData)
};
// 博客右侧广告
export const _rightAd = async (formData={})=>{
  formData['site'] = site
  formData['space_id'] = blogRightAd
  return await Http.request(Api.adUrl, Method.GET,formData)
};