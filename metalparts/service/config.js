/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-14 16:01:34
 * @LastEditTime: 2020-03-20 12:35:42
 * @LastEditors: Xuannan
 */
export const siteInfo = {
        banner:'maitulBanner',
        about:'about',
        products:'products',
        news:'news',
        site:'metalparts',
        articlePageSize:8,
        productPageSize:12,
        contentPageSize:1000,
    }
  
export const api = {
        contentUrl:`/api/cms/${siteInfo.site}/content`,//内容
        messageUrl:'/api/message',//留言
        siteDataUrl:`/api/${siteInfo.site}/data`,//站点数据
    }
    


export const config = {
        // 超时设置
        timeout: 10000,
        // 跨域是否带Token
        withCredentials: true,
        // 响应的数据格式 json / blob /document /arraybuffer / text / stream
        responseType: 'json',
    }