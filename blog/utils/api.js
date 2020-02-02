/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2020-02-02 22:35:08
 * @LastEditors  : Xuannan
 */
import {Method} from "./http";


const Http = require('./http');

const site = 'blog'
const webconfigUrl = '/api/webconfig'
const proxy = "http://127.0.0.1:5000"


//登录
export const _webconfig = async (data={})=>{
  data['site'] = site
  return await Http.request(proxy+webconfigUrl, Method.GET, data)
};

