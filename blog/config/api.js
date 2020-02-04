/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2020-02-04 20:07:55
 * @LastEditors  : Xuannan
 */
let proxy = "http://127.0.0.1:5000/api"

let Api = {
  site:{site:'blog'},
  webconfigUrl:proxy + '/webconfig' ,  //  站点配置接口
  categoryUrl:proxy+'/cms/blog/category',//博客分类
  
}

export default Api;