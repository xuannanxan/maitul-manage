/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:28
 * @LastEditTime : 2020-02-03 22:51:49
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
        localStorage.setItem('jwToken',res.data.token)
        //继续请求之前的内容
        request(api, method, params , config).then(res2=>{
          resolve(res2);
        })
      }else{
        resolve(res);
      }
    })
      .catch(error => {
        console.dir(error);
        
        //如果没有登录或被T，跳回登录页面
        if(error.response){
          if(error.response.status === 500 || error.response.data === undefined){
            message.error('服务器连接失败...');
          }else{
              if(error.response.data.status === 1403){
                localStorage.removeItem('jwToken') 
                window.location = '/login';
              }else{
                message.error(error.response.data.msg ? error.response.data.msg : JSON.stringify(error.response.data));
              }
          }
        }else{
          message.error('服务器连接失败...');
        }
        reject(error);
      });
  });
};

