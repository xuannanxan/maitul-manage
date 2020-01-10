/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2020-01-10 10:51:16
 * @LastEditors  : Xuannan
 */
import {Method} from "./http";


const Http = require('./http');
const menuUrl = '/api/admin/menu'
const ruleUrl = '/api/admin/rule'
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
//修改用户的信息/api/admin/current_user
export const _changeUserInfo = async (formData)=>{
  return await Http.request('/api/admin/current_user', Method.POST,formData)
};
//修改密码/api/admin/current_user
export const _changeUserPwd = async (formData)=>{
  return await Http.request('/api/admin/current_user', Method.PUT,formData)
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

// 菜单--------------------------
// 后台菜单树 /api/admin/menu
export const _menuTree = async ()=>{
  return await Http.request(menuUrl, Method.GET)
};

//新增菜单/api/admin/menu
export const _menuAdd = async (formData)=>{
  return await Http.request(menuUrl, Method.POST,formData)
};

//修改菜单 /api/admin/menu
export const _menuEdit = async (formData)=>{
  return await Http.request(menuUrl, Method.PUT,formData)
};
//删除菜单 /api/admin/menu
export const _menuDelete = async (id)=>{
  return await Http.request(menuUrl, Method.DELETE,{id})
};

// 权限--------------------------
// 权限列表 /api/admin/rule
export const _ruleList = async ()=>{
  return await Http.request(ruleUrl, Method.GET)
};

//新增菜单/api/admin/menu
export const _ruleAdd = async (formData)=>{
  return await Http.request(ruleUrl, Method.POST,formData)
};

//修改菜单 /api/admin/menu
export const _ruleEdit = async (formData)=>{
  return await Http.request(ruleUrl, Method.PUT,formData)
};
//删除菜单 /api/admin/menu
export const _ruleDelete = async (id)=>{
  return await Http.request(ruleUrl, Method.DELETE,{id})
};