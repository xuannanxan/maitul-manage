/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:45:12
 * @LastEditTime: 2020-02-16 20:36:41
 * @LastEditors: Xuannan
 */
/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:45:12
 * @LastEditTime : 2020-02-14 22:49:33
 * @LastEditors  : Xuannan
 */
import {api,siteInfo}  from "@/service/config"
import request from "@/service";
import cookieparse from '@/utils/cookieparse'


export const nuxtServerInit=({ commit }, { req })=>{
  let cookie = req.headers.cookie;
  // 将cookie转成json对象（自己实现该方法）
  let token = cookieparse(cookie,req).token;
  commit('setToken', token);
};
//配置信息
export const _webconfig = async (store, params={})=>{
  params['site'] = siteInfo.site
  return await request.get(api.webconfigUrl, { params: params })
};
//分类信息
export const _category = async (store, params={})=>{
  params['site'] = siteInfo.site
  return await request.get(api.categoryUrl, { params: params })
};
//banner信息
export const _banner = async (store, params={})=>{
  params['site'] = siteInfo.site
  params['space_id'] = siteInfo.blogBanner
  return await request.get(api.adUrl, { params: params })
};

//右侧广告
export const _rightAd = async (store, params={})=>{
  params['site'] = siteInfo.site
  params['space_id'] = siteInfo.blogRightAd
  return await request.get(api.adUrl, { params: params })
};
//内容
export const _content = async (store, params={})=>{
  params['site'] = siteInfo.site
  return await request.get(api.contentUrl, { params: params })
};


  