#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 09:14:35
@LastEditTime: 2019-12-17 14:57:56
@LastEditors: Xuannan
'''
from app.models.admin import Admin
from flask import g
from flask_restful import abort,reqparse
from app.ext import cache
from app.apis.common.auth import Auth
from app.apis.api_constant import *
import datetime


parse_authorization = reqparse.RequestParser()
parse_authorization.add_argument('Authorization', type=str, location='headers')

def get_admin(ident):
    '''
    通过用户名识别用户
    '''
    if not ident:
        return None
    admin = Admin.query.get(ident)
    if admin and admin.is_del=='0':
        return admin
    return None

def _verify():
    token = get_token()
    if not token:
        abort(RET.Forbidden,msg='请登录')    
    token_data = Auth.decode_auth_token(token)
    token_id = token_data['data']['id']
    token_time = token_data['data']['login_time']
    # cache 记录的token
    cache_token = cache.get(token_id)
    if not cache_token:
        abort(RET.Forbidden,msg='请重新登录!')
    # 其他用户异地登录
    if cache_token != token:
        abort(RET.Forbidden,msg='当前账户在其他地方登录，您已被强制下线！')
    # 用户是否存在
    admin = get_admin(token_id)
    if not admin:
        abort(RET.Forbidden,msg='请重新登录')
    # 超时生成新的token
    now_time = datetime.datetime.now()
    g.admin = admin
    g.auth = token
    # 超过15分钟就要重新获取token
    if (datetime.datetime.strptime(token_time, "%Y-%m-%d %H:%M:%S")+datetime.timedelta(minutes=15))<now_time:
        cache.delete(token) 
        new_token = Auth.encode_auth_token(admin.id)
        cache.set(admin.id,new_token,timeout=60*60*7)
        data = {
            'status':RET.RESETOKEN,
            'token':new_token
        }
        return data
    

def login_required(fun):
    '''
    登录的装饰器，需要登录才能进行访问
    '''
    def wrapper(*args,**kwargs):
        data = _verify()
        if data :
            return data
        return fun(*args,**kwargs)
    return wrapper

def permission_required(permission):
    def permission_required_wrapper(fun):
        def wrapper(*args,**kwargs):
            _verify()
            if not g.user.check_permission(permission):
                abort(403,msg='权限不足')
            return fun(*args,**kwargs)
        return wrapper
    return permission_required_wrapper


def logout():
    '''
    登出
    '''
    token = get_token()
    token_data = Auth.decode_auth_token(token)
    token_id = token_data['data']['id']
    cache.delete(token_id) 

def get_token():
    args_authorization = parse_authorization.parse_args()
    auth_header = args_authorization.get('Authorization')
    return Auth.header_to_token(auth_header)
