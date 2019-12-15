#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 09:14:35
@LastEditTime: 2019-12-15 23:11:07
@LastEditors: Xuannan
'''
from app.models.admin import Admin
from flask import request,g
from flask_restful import abort
from app.ext import cache

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
    token = request.args.get('token')
    if not token:
        abort(401,msg='请登录')
    user_id = cache.get(token)
    if not user_id:
        abort(401,msg='请重新登录')
    user = get_user(user_id)
    if not user:
        abort(401,msg='请重新登录')
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
    token = request.args.get('token')
    cache.delete(token) 