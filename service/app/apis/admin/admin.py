#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-15 22:25:14
@LastEditTime: 2019-12-17 01:22:21
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
class AdminLogin(Resource):
    def post(self):
        """
        管理员登录
        """
        args_login = parse_login.parse_args()
        password = args_login.get('password')
        username = args_login.get('username').lower()
        admin = get_admin(username) 
        if not admin:
            abort(RET.BadRequest,msg='用户名或密码错误')
        if (not admin.check_pwd(password)) or admin.is_del != '0':
            abort(RET.Unauthorized,msg='用户名或密码错误')
        token = Auth.encode_auth_token(admin.id)
        cache.set(token,admin.id,timeout=60*60*7)
        data = {
            'status':RET.OK,
            'msg':'登录成功',
            'token':token
        }
        return data
       

class AdminAdd(Resource):
    def post(self):
        """
        新增管理员
        """
        args_register = parse_register.parse_args()
        password = args_register.get('password')
        username = args_register.get('username').lower()
        name = args_register.get('name')
        email = args_register.get('email')
        phone = args_register.get('phone')
        if get_admin(username):
            abort(RET.BadRequest,msg='用户已存在')
      
        admin = Admin()
        admin.username = username
        admin.password = password
        admin.name = name
        admin.email = email
        admin.phone = phone
        if admin.add():
            data = {
                'status':RET.Created,
                'msg':'注册成功',
                'data':admin
            }
            return marshal(data,sing_user_fields)
        abort(RET.BadRequest,msg='注册失败')
        
            

    @login_required
    def get(self):
        '''
        获取用户信息
        '''
        if g.admin:
            data = {
                    'status':RET.OK,
                    'data':object_to_json(g.admin)
                }
            return data
        abort(RET.BadRequest,msg='请勿非法操作')

    @login_required   
    def put(self):
        '''
        修改用户信息
        '''
        # 修改密码
        if action == USER_ACTION_CHANGE_PWD:
            args = parse_change_pwd.parse_args()
            password = args.get('password')
            new_password = args.get('new_password')
            action = args.get('action').lower()
            user = g.user
            if (not user.check_pwd(password)) or user.is_del != '0':
                abort(RET.Unauthorized,msg='用户名或密码错误')
            user.password = new_password
            if user.updata():
                logout()
                return  {
                    'status':RET.OK,
                    'msg':'修改成功',
                    }
            abort(RET.BadRequest,msg='修改密码失败')
        # 修改用户信息
        elif action == USER_ACTION_CHANGE_INFO:
            
            pass


        
        