/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-14 16:01:34
 * @LastEditTime: 2020-02-22 19:32:02
 * @LastEditors: Xuannan
 */
export const siteInfo = {
        banner:'maitulBanner',
        blogRightAd:'20200117223636718',
        about:'about',
        products:'product',
        news:'news',
        site:'maitul',
    }
  
export const api = {
        webconfigUrl: '/api/webconfig' ,  //  站点配置接口
        categoryUrl:`/api/cms/${siteInfo.site}/category`,//博客分类
        contentUrl:`/api/cms/${siteInfo.site}/content`,//博客内容
        adUrl:'/api/resource/ad',//博客广告
        tagsUrl:`/api/cms/${siteInfo.site}/tag`,//博客标签
    }
    


export const config = {
        // 超时设置
        timeout: 10000,
        // 跨域是否带Token
        withCredentials: true,
        // 响应的数据格式 json / blob /document /arraybuffer / text / stream
        responseType: 'json',
    }