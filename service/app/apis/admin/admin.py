#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-15 22:25:14
@LastEditTime: 2019-12-17 15:50:41
@LastEditors: Xuannan
'''


from flask_restful import Resource,reqparse,fields,marshal,abort,inputs
from app.models.admin import Admin
from app.apis.api_constant import *
from .common import get_admin,login_required,logout
import uuid,datetime
from app.ext import cache
from flask import g
from app.utils import object_to_json
from app.apis.common.auth import Auth
from app.config import PAGINATE_NUM

# 新增
parse_register = reqparse.RequestParser()
parse_register.add_argument('username',type=str,required=True,help='请输入用户名')
parse_register.add_argument('password',type=str,required=True,help='请输入密码')
parse_register.add_argument('email',type=str,required=True,help='请输入邮箱地址')
parse_register.add_argument('name',type=str,required=True,help='请输入姓名')
parse_register.add_argument('phone',type=inputs.regex(r'1[35789]\d{9}'),required=True,help='手机号码错误')
# 登录
parse_login = reqparse.RequestParser()
parse_login.add_argument('username',type=str,required=True,help='请输入用户名!')
parse_login.add_argument('password',type=str,required=True,help='请输入密码!')
# 修改密码
parse_change_pwd = reqparse.RequestParser()
parse_change_pwd.add_argument('password',type=str,required=True,help='请输入原密码!')
parse_change_pwd.add_argument('new_password',type=str,required=True,help='请输入新密码!')
# 修改基本信息
parse_info = reqparse.RequestParser()
parse_info.add_argument('email',type=str,required=True,help='请输入邮箱地址')
parse_info.add_argument('name',type=str,required=True,help='请输入姓名')
parse_info.add_argument('phone',type=inputs.regex(r'1[35789]\d{9}'),required=True,help='手机号码错误')
# 分页信息
parse_page = reqparse.RequestParser()
parse_page.add_argument('page',type=int,help='页码只能是数字')
parse_page.add_argument('paginate',type=int,help='每页数量只能是数字')

user_fields = {
    'username':fields.String,
    'name':fields.String,
    'email':fields.String,
    'phone':fields.String
}

sing_user_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(user_fields)
}


class AdminCurrent(Resource):    
    # 当前用户信息    
    @login_required
    def get(self):
        '''
        file: yml/admin/login.yml
        '''
        if g.admin:
            data = {
                    'status':RET.OK,
                    'data':object_to_json(g.admin)
                }
            return data
        abort(RET.BadRequest,msg='请勿非法操作')

    # 修改密码
    @login_required
    def put(self):
        '''
        file: yml/admin/changepwd.yml
        '''
        args = parse_change_pwd.parse_args()
        password = args.get('password')
        new_password = args.get('new_password')
        admin = g.admin
        if (not admin.check_pwd(password)) or admin.is_del != '0':
            abort(RET.Unauthorized,msg='用户名或密码错误')
        admin.password = new_password
        if admin.updata():
            logout()
            return  {
                'status':RET.OK,
                'msg':'密码修改成功，请重新登录',
                }
        abort(RET.BadRequest,msg='修改密码失败')

    # 修改用户信息
    @login_required
    def post(self):
        '''
        file: yml/admin/changeinfo.yml
        '''
        args = parse_info.parse_args()
        name = args.get('name')
        email = args.get('email')
        phone = args.get('phone')
        admin = g.admin
        admin.name = name
        admin.email = email
        admin.phone = phone
        if admin.updata():
            return  {
                'status':RET.OK,
                'msg':'修改成功',
                }
        abort(RET.BadRequest,msg='修改失败')

       
class AdminList(Resource):
    @login_required
    def get(self):
        '''
        file: yml/admin/list.yml
        '''
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        admin_list = Admin.query.filter_by(is_del = '0').order_by(Admin.id.desc()).paginate(page, paginate, False)
        if not admin_list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'paginate':{
                        'page':admin_list.page,
                        'per_page':admin_list.per_page,
                        'total':admin_list.total
                    },
                    'data':[object_to_json(v) for v in admin_list.items]
            }
        return data 


class AdminAdd(Resource):
    @login_required
    def post(self):
        '''
        file: yml/admin/add.yml
        '''
        args_register = parse_register.parse_args()
        password = args_register.get('password')
        username = args_register.get('username').lower()
        name = args_register.get('name')
        email = args_register.get('email')
        phone = args_register.get('phone')
        has_admin = Admin.query.filter_by(username = username,is_del='0').first()
        if has_admin:
            abort(RET.Forbidden,msg='管理员已存在')     
        admin = Admin()
        admin.username = username
        admin.password = password
        admin.name = name
        admin.email = email
        admin.phone = phone
        if admin.add():
            data = {
                'status':RET.Created,
                'msg':'新增管理员成功',
                'data':admin
            }
            return marshal(data,sing_user_fields)
        abort(RET.BadRequest,msg='新增失败')
        
            
class AdminResource(Resource):
    @login_required
    def get(self,id):
        '''
        file: yml/admin/get.yml
        '''
        admin = get_admin(id)
        if not admin:
            abort(RET.BadRequest,msg='用户不存在!!!')
        data = {
                    'status':RET.OK,
                    'data':object_to_json(admin)
                }
        return data
       
    # 重置密码
    @login_required   
    def put(self,id):
        '''
        file: yml/admin/put.yml
        '''
        admin = get_admin(id)
        admin.password = '123456a'
        if admin.updata():
            # 清除用户登录状态
            cache.delete(admin.id) 
            return  {
                'status':RET.OK,
                'msg':'重置密码成功',
                }
        abort(RET.BadRequest,msg='重置密码失败')

        
    @login_required 
    def delete(self,id):
        '''
        file: yml/admin/del.yml
        '''
        admin = get_admin(id)
        if not admin:
            abort(RET.BadRequest,msg='用户不存在!!!')
        if admin.is_super == 1:
            abort(RET.BadRequest,msg='删除失败!!!')
        admin.is_del = admin.id
        result = Admin().updata()
        if result:
            # 清除用户登录状态
            cache.delete(admin.id) 
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        
class AdminLogin(Resource):
    def post(self):
        '''
        file: yml/admin/login.yml
        '''
        args_login = parse_login.parse_args()
        password = args_login.get('password')
        username = args_login.get('username').lower()
        admin = Admin.query.filter_by(username = username,is_del='0').first()
        if not admin:
            abort(RET.BadRequest,msg='用户名或密码错误')
        if not admin.check_pwd(password):
            abort(RET.Unauthorized,msg='用户名或密码错误')
        token = Auth.encode_auth_token(admin.id)
        cache.set(admin.id,token,timeout=60*60*7)
        data = {
            'status':RET.OK,
            'msg':'登录成功',
            'token':token
        }
        return data