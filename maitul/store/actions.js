/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:45:12
 * @LastEditTime: 2020-02-27 13:14:09
 * @LastEditors: Xuannan
 */
/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:45:12
 * @LastEditTime : 2020-02-14 22:49:33
 * @LastEditors  : Xuannan
 */
import {api,siteInfo}  from "@/config"
import request from "@/service";
import cookieparse from '@/utils/cookieparse'


export const nuxtServerInit=({ commit }, { req })=>{
  let cookie = req.headers.cookie;
  // 将cookie转成json对象（自己实现该方法）
  let token = cookieparse(cookie,req).token;
  commit('setToken', token);
};

//内容
export const _content = async (store, params={})=>{
  params['site'] = siteInfo.site
  return await request.get(api.contentUrl, { params: params })
};

//留言
export const _message = async (store, params={})=>{
  params['site'] = siteInfo.site
  return await request.post(api.messageUrl, params)
};


//站点数据
export const _siteData = async ()=>{
  return await request.get(api.siteDataUrl)
};
  