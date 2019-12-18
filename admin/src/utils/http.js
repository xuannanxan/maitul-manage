/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:28
 * @LastEditTime : 2019-12-18 21:59:56
 * @LastEditors  : Xuannan
 */

import axios from 'axios';
import {message} from 'antd';

let baseUrl = "http://127.0.0.1:5000";
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
  const apiToken = localStorage.getItem('jwToken');
  const data = (method === 'GET') ? 'params' : 'data';
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Authorization': `JWT ${apiToken}`,
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
    }).then(resolve)
      .catch(error => {
        console.dir(error);
        message.error(error.response.data.msg ? error.response.data.msg : JSON.stringify(error.response.data));
        reject(error);
      });
  });
};