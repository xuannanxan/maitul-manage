import {Method} from "./http";

const Http = require('./http');

export const _login = async (username,password)=>{
  return await Http.request('/api/login', Method.POST, {
    username,
    password
  })
};

export const _contentList = async (page,paginate,tag,category_id,search)=>{
  return await Http.request('/api/blog/content/list', Method.GET, {
    page,
    paginate,
    tag,
    category_id,
    search
  })
};