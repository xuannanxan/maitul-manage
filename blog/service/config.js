/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-14 16:01:34
 * @LastEditTime : 2020-02-14 22:30:27
 * @LastEditors  : Xuannan
 */
export const siteInfo = {
        blogBanner:'20200117223623299',
        blogRightAd:'20200117223636718',
        site:'blog',
    }
  
export const api = {
        webconfigUrl: '/api/webconfig' ,  //  站点配置接口
        categoryUrl:'/api/cms/blog/category',//博客分类
        contentUrl:'/api/cms/blog/content',//博客内容
        adUrl:'/api/resource/ad',//博客广告
        captchaUrl:'/api/captcha'
    }
    


export const config = {
        // 超时设置
        timeout: 10000,
        // 跨域是否带Token
        withCredentials: true,
        // 响应的数据格式 json / blob /document /arraybuffer / text / stream
        responseType: 'json',
    }