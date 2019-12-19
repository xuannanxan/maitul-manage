/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:28
 * @LastEditTime : 2019-12-18 21:59:56
 * @LastEditors  : Xuannan
 */

import axios from 'axios';
import {message} from 'antd';





export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH:'PATCH'
};

/**
 * 模块说明:有api_token的请求
 */
export const request = (api, method = Method.GET, params = {}, config = {}) => {
  const apiToken = localStorage.getItem('jwToken')?`JWT ${localStorage.getItem('jwToken')}`:'';
  const data = (method === 'GET') ? 'params' : 'data';
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Authorization': apiToken,
  };
  if (config.headers) {
    headers = {
      ...headers,
      ...config.headers
    }
  }
  return new Promise((resolve, reject) => {
    axios({
      url: api,
      method,
      [data]: params,
      headers,
    }).then(res=>{
      // 重新获取token
      if(res.data.status === 1500){
        localStorage.removeItem('jwToken')
        localStorage.setItem('jwToken',res.data.token)
      }else{
        resolve(res);
      }
    })
      .catch(error => {
        console.dir(error);
        message.error(error.response.data.msg ? error.response.data.msg : JSON.stringify(error.response.data));
        //如果没有登录或被T，跳回登录页面
        if(error.response.data.status === 1403){
          localStorage.removeItem('jwToken')
          window.location = '/login';
        }
        reject(error);
      });
  });
};