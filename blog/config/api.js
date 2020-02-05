/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2020-02-05 20:47:43
 * @LastEditors  : Xuannan
 */
let proxy = "http://127.0.0.1:5000/api"

let Api = {
  site:{site:'blog'},
  blogBaner:{space_id:'20200117223623299'},//博客banner
  blogRightAd:{space_id:'20200117223636718'},//博客右侧广告
  webconfigUrl:proxy + '/webconfig' ,  //  站点配置接口
  categoryUrl:proxy+'/cms/blog/category',//博客分类
  contentUrl:proxy+'/cms/blog/content',//博客内容
  adUrl:proxy+'/resource/ad',//博客广告
  
}

export default Api;