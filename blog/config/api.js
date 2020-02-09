/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2020-02-09 19:12:02
 * @LastEditors  : Xuannan
 */
import axios from 'axios';

let proxy = "http://127.0.0.1:5000/api"
let site = 'blog'
let blogBanner = '20200117223623299'
let blogRightAd = '20200117223636718'

export const _Url = {
  blogBanner:blogBanner,
  blogRightAd:blogRightAd,
  webconfigUrl:proxy + '/webconfig' ,  //  站点配置接口
  categoryUrl:proxy+'/cms/blog/category',//博客分类
  contentUrl:proxy+'/cms/blog/content',//博客内容
  adUrl:proxy+'/resource/ad',//博客广告
  captchaUrl:proxy+'/captcha'
}

export const _Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH:'PATCH'
};


export const _Api =  (url,params={},method='GET')=>{
  params['site'] = site
  return new Promise(resolve=>{
    axios({url:url,method:method,params:params}).then(res=>{
      if(res.data.status===200){
        resolve(res.data)
      }else{
        resolve(res)
      }
    }).catch(error=>{
      console.log(error.response)
      resolve({status:error.response?error.response.status:502})
    })
  })
}

