/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-18 21:53:35
 * @LastEditTime : 2020-01-14 17:11:07
 * @LastEditors  : Xuannan
 */
import {Method} from "./http";


const Http = require('./http');
const menuUrl = '/api/admin/menu'
const ruleUrl = '/api/admin/rule'
const roleUrl = '/api/admin/role'
const adminUrl = '/api/admin'
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
//修改登录用户的信息/api/admin/current_user
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

//新增权限/api/admin/rule
export const _ruleAdd = async (formData)=>{
  return await Http.request(ruleUrl, Method.POST,formData)
};

//修改权限/api/admin/rule
export const _ruleEdit = async (formData)=>{
  return await Http.request(ruleUrl, Method.PUT,formData)
};
//删除权限 /api/admin/rule
export const _ruleDelete = async (id)=>{
  return await Http.request(ruleUrl, Method.DELETE,{id})
};
// 角色--------------------------
// 角色列表 /api/admin/role
export const _roleList = async ()=>{
  return await Http.request(roleUrl, Method.GET)
};

//新增角色/api/admin/role
export const _roleAdd = async (formData)=>{
  return await Http.request(roleUrl, Method.POST,formData)
};

//修改角色 /api/admin/role
export const _roleEdit = async (formData)=>{
  return await Http.request(roleUrl, Method.PUT,formData)
};
//删除角色 /api/admin/role
export const _roleDelete = async (id)=>{
  return await Http.request(roleUrl, Method.DELETE,{id})
};
//角色授权 /api/admin/role/auth
export const _roleAuth = async (formData)=>{
  return await Http.request(roleUrl+'/auth', Method.POST,formData)
};
//获取单个角色 /api/admin/role
export const _getRole = async (id)=>{
  return await Http.request(roleUrl, Method.GET,{id})
};

// 管理员--------------------------
// 管理员列表 /api/admin
export const _adminList = async ()=>{
  return await Http.request(adminUrl, Method.GET)
};

//新增管理员/api/admin
export const _adminAdd = async (formData)=>{
  return await Http.request(adminUrl, Method.POST,formData)
};

//修改管理员 /api/admin
export const _adminEdit = async (formData)=>{
  return await Http.request(adminUrl, Method.PUT,formData)
};
//删除管理员 /api/admin
export const _adminDelete = async (id)=>{
  return await Http.request(adminUrl, Method.DELETE,{id})
};
//管理员授权 /api/admin/auth
export const _adminAuth = async (formData)=>{
  return await Http.request(adminUrl+'/auth', Method.POST,formData)
};
