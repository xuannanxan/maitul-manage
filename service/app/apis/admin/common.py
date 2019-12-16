#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 09:14:35
@LastEditTime: 2019-12-16 17:24:15
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
    if admin:
        return admin
    admin = Admin.query.filter(Admin.username == ident).first()
    if admin:
        return admin
    return None

def _verify():
    args_authorization = parse_authorization.parse_args()
    auth_header = args_authorization.get('Authorization')
    token = Auth.header_to_token(auth_header)
    if not token:
        abort(RET.Unauthorized,msg='请登录')    
    # cache 记录的id
    cache_id = cache.get(token)
    if not cache_id:
        abort(RET.Unauthorized,msg='请重新登录')
    token_data = Auth.decode_auth_token(token)
    token_id = token_data['data']['id']
    token_time = token_data['data']['login_time']
    # token被篡改
    if cache_id != token_id:
        abort(RET.Unauthorized,msg='请勿非法操作')
    # 超时生成新的token
    now_time = datetime.datetime.now()
    print (now_time-datetime)
    user = get_admin(cache_id)
    if not user:
        abort(RET.Unauthorized,msg='请重新登录')
    g.user = user
    g.auth = token    

def login_required(fun):
    '''
    登录的装饰器，需要登录才能进行访问
    '''
    def wrapper(*args,**kwargs):
        _verify()
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
    args_authorization = parse_authorization.parse_args()
    auth_header = args_authorization.get('Authorization')
    token = Auth.header_to_token(auth_header)
    cache.delete(token) 