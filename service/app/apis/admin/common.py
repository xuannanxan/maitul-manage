#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 09:14:35
@LastEditTime : 2020-02-01 17:21:48
@LastEditors  : Xuannan
'''
from app.models import Admin, Crud
from flask import g,request
from flask_restful import abort,reqparse
from app.ext import cache
from app.apis.common import Auth
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
    admin = Admin.query.filter_by(id = ident , is_del = '0').first()
    if not admin:
        abort(RET.NotFound,msg='用户不存在',status=RET.REENTRY)
    return admin

def _verify():
    token = get_token()
    if not token:
        abort(RET.Forbidden,msg='请登录',status=RET.REENTRY)    
    token_data = Auth.decode_auth_token(token)
    token_id = token_data['data']['id']
    token_time = token_data['data']['login_time']
    # cache 记录的token，如果cache中没有这个token
    cache_token = cache.get(token_id)
    if not cache_token:
        abort(RET.Forbidden,msg='请重新登录!',status=RET.REENTRY)
    # 用户是否存在
    admin = get_admin(token_id)
    if not admin:
        abort(RET.Forbidden,msg='请重新登录',status=RET.REENTRY)
    # 超时生成新的token
    now_time = datetime.datetime.now()
    g.admin = admin
    # g.auth = token
    # 超过30分钟就要重新获取token
    if (datetime.datetime.strptime(token_time, "%Y-%m-%d %H:%M:%S")+datetime.timedelta(minutes=30))<now_time:
        cache.delete(token) 
        new_token = Auth.encode_auth_token(admin.id)
        cache.set(admin.id,new_token,timeout=60*60*7)
        data = {
            'status':RET.RESETOKEN,
            'token':new_token
        }
        return data
    # 其他用户异地登录
    if cache_token != token:
        abort(RET.Forbidden,msg='当前账户在其他地方登录，您已被强制下线！',status=RET.REENTRY)
    
        

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



def permission_required(fun):
    '''
    权限的装饰器，需要有权限才能进行访问
    '''
    def wrapper(*args,**kwargs):
        _permission()    
        return fun(*args,**kwargs)
    return wrapper

def _permission():
    admin = g.admin
    if not admin:
        abort(RET.NotFound,msg='请登录后访问')
    # 是否有权限
    if admin.is_super == 0 :
        # 获取权限列表
        method = request.method
        path = request.path
        sql = '''
        SELECT  CONCAT(r.url,':',r.method) as 'request', r.*
        FROM admin as a
        left join admin_role as ar on a.id = ar.admin_id
        left join role_rule as rr on rr.role_id = ar.role_id
        left join rule as r on r.id = rr.rule_id
        WHERE a.is_del = 0
        AND a.id = %s
        '''%admin.id
        sql_data = Crud.auto_select(sql)
        fetchall_data = sql_data.fetchall()
        rules = list(set([v.request for v in fetchall_data]))
        # 当前用户的菜单和权限
        g.menus = list(set([v.menu_id for v in fetchall_data]))
        g.auth = fetchall_data
        if (path+':'+method) not in rules:
            abort(RET.Forbidden,msg='您的权限不足，请联系管理员')

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
    return Auth.header_to_token(auth_header,'JWT')
