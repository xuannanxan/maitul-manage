/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2019-12-28 22:37:41
 * @LastEditors  : Xuannan
 */
import {Method} from "./http";


const Http = require('./http');
//登录
export const _login = async (username,password,captcha,image_code)=>{
  return await Http.request('/api/login', Method.POST, {
    username,
    password,
    captcha,
    image_code
  })
};

//登出
export const _logout = async ()=>{
  return await Http.request('/api/login', Method.DELETE)
};

//图片验证码
export const _captcha = async (image_code)=>{
  return await Http.request('/api/captcha', Method.GET, {
    image_code
  })
};

//获取登录用户的信息/api/admin/current_user
export const _currentUser = async ()=>{
  return await Http.request('/api/admin/current_user', Method.GET)
};

//获取博客内容列表
export const _contentList = async (page,paginate,tag,category_id,search)=>{
  return await Http.request('/api/blog/content/list', Method.GET, {
    page,
    paginate,
    tag,
    category_id,
    search
  })
};

//文件上传
export const _fileUpload = async (formData)=>{
  return await Http.request('/api/upload', Method.POST,formData,{headers: {'Content-Type': 'multipart/form-data'}
  })
}

// 后台菜单树 /api/admin/menu/tree
export const _menuTree = async ()=>{
  return await Http.request('/api/admin/menu/tree', Method.GET)
};