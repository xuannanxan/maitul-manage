/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-03-22 19:51:35
 * @LastEditTime: 2020-04-01 15:36:45
 * @LastEditors: Xuannan
 */

// 语言配置
export const i18n = {
    locales: ['en', 'zh'],
    locale: 'en'
}

// 站点信息配置
export const siteInfo = {
    enBanner:'maitulBanner',
    zhBanner:'blogRightAd',
    site:'info',
    articlePageSize:8,
    productPageSize:12,
}
//api地址
export const api = {
    contentUrl:`/api/${siteInfo.site}/content`,//内容
    messageUrl:'/api/message',//留言
    siteDataUrl:`/api/${siteInfo.site}/data`,//站点数据
}

// axios配置
export const axiosConfig = {
    // 超时设置
    timeout: 10000,
    // 跨域是否带Token
    withCredentials: true,
    // 响应的数据格式 json / blob /document /arraybuffer / text / stream
    responseType: 'json',
}