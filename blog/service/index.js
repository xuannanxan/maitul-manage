/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-14 16:02:55
 * @LastEditTime : 2020-02-14 19:56:14
 * @LastEditors  : Xuannan
 */
import axios from 'axios'
// import qs from 'qs'
import {config,api} from './config'

if (process.server) {
  config.baseURL = process.env.BASE_URL
}

const service = axios.create(config)

// POST 传参序列化
service.interceptors.request.use(
  config => {
    // if (config.method === 'post') config.data = qs.stringify(config.data)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 返回状态判断
service.interceptors.response.use(
  res => {
    return Promise.resolve(res.data)
  },
  error => {
    //console.dir(error);
    return Promise.reject(error)
  }
)

export default service