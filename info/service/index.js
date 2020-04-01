/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-14 16:02:55
 * @LastEditTime: 2020-03-26 14:51:13
 * @LastEditors: Xuannan
 */
import axios from 'axios'
// import qs from 'qs'
import {axiosConfig} from '@/config'

if (process.server) {
  axiosConfig.baseURL = process.env.BASE_URL
}

const service = axios.create(axiosConfig)

// POST 传参序列化
service.interceptors.request.use(
  axiosConfig => {
    // if (config.method === 'post') config.data = qs.stringify(config.data)
    return axiosConfig
  },
  error => {
    return Promise.reject(error)
  }
)
// 返回状态判断
service.interceptors.response.use(
  res => {
    if(res.data.status===200){
      return Promise.resolve(res.data)
    }else{
      return Promise.resolve({status:res.data.status})
    }
    
  },
  error => {
    //console.dir(error);
    if(error.response){
      return Promise.resolve({status:error.response.status})
    }else{
      return Promise.resolve({status: 500, message: 'Failed to get data' })
    }
  }
)

export default service