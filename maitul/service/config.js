/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-14 16:01:34
 * @LastEditTime: 2020-03-19 14:47:40
 * @LastEditors: Xuannan
 */
export const siteInfo = {
        banner:'maitulBanner',
        about:'about',
        products:'products',
        news:'news',
        site:'maitul',
        articlePageSize:8,
        productPageSize:12,
        contentPageSize:1000,
    }
  
export const api = {
        webconfigUrl: '/api/webconfig' ,  //  站点配置接口
        categoryUrl:`/api/cms/${siteInfo.site}/category`,//分类
        contentUrl:`/api/cms/${siteInfo.site}/content`,//内容
        adUrl:'/api/resource/ad',//广告
        tagsUrl:`/api/cms/${siteInfo.site}/tag`,//标签
        messageUrl:'/api/message',//留言
    }
    


export const config = {
        // 超时设置
        timeout: 10000,
        // 跨域是否带Token
        withCredentials: true,
        // 响应的数据格式 json / blob /document /arraybuffer / text / stream
        responseType: 'json',
    }