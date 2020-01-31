#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-15 22:25:14
@LastEditTime : 2020-01-15 19:07:54
@LastEditors  : Xuannan
'''


from flask_restful import Resource,reqparse,fields,marshal,abort,inputs
from app.models import Admin,AdminLog,AdminRole, Crud
from app.apis.api_constant import *
from .common import get_admin,login_required,logout,permission_required
import uuid,datetime,json
from app.ext import cache
from flask import g,request
from app.utils import object_to_json,mysql_to_json
from app.apis.common.auth import Auth
from app.config import PAGINATE_NUM
from app.utils.api_doc import Apidoc
from app.api_docs.admin import admin_doc

api = Apidoc('系统-系统管理员')

# 单数据操作
parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)

# 新增
parse_register = reqparse.RequestParser()
parse_register.add_argument('username',type=str,required=True,help='请输入用户名')
parse_register.add_argument('password',type=str,required=True,help='请输入密码')
parse_register.add_argument('email',type=str,required=True,help='请输入邮箱地址')
parse_register.add_argument('name',type=str,required=True,help='请输入姓名')
parse_register.add_argument('phone',type=inputs.regex(r'1[35789]\d{9}'),required=True,help='手机号码错误')

# 授权
parse_role = parse_id.copy()
parse_role.add_argument('roles',type=str,required=True,help='请设置角色')
# 登录
parse_login = reqparse.RequestParser()
parse_login.add_argument('username',type=str,required=True,help='请输入用户名!')
parse_login.add_argument('password',type=str,required=True,help='请输入密码!')
parse_login.add_argument('captcha')
parse_login.add_argument('image_code')
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
    @api.doc(api_doc=admin_doc.get_admin)
    @login_required
    def get(self):
        '''
        获取当前登录用户的信息
        '''
        if g.admin:
            data = {
                    'status':RET.OK,
                    'data':object_to_json(g.admin)
                }
            return data
        abort(RET.BadRequest,msg='请勿非法操作')

    # 修改密码
    @api.doc(api_doc=admin_doc.change_pwd)
    @login_required
    def put(self):
        args = parse_change_pwd.parse_args()
        password = args.get('password')
        new_password = args.get('new_password')
        admin = g.admin
        if (not admin.check_pwd(password)) or admin.is_del != '0':
            abort(RET.Unauthorized,msg='密码错误')
        admin.password = new_password
        admin.last_editor = g.admin.username
        if admin.updata():
            logout()
            return  {
                'status':RET.REENTRY,
                'msg':'密码修改成功，请重新登录',
                }
        abort(RET.BadRequest,msg='修改密码失败')

    # 修改用户信息
    @api.doc(api_doc=admin_doc.change_info)
    @login_required
    def post(self):
        '''
        修改用户信息
        '''
        args = parse_info.parse_args()
        name = args.get('name')
        email = args.get('email')
        phone = args.get('phone')
        admin = g.admin
        admin.name = name
        admin.email = email
        admin.phone = phone
        admin.last_editor = g.admin.username
        if admin.updata():
            return  {
                'status':RET.OK,
                'msg':'修改成功',
                }
        abort(RET.BadRequest,msg='修改失败')

# 设置管理员角色
class AdminAuth(Resource):
    @api.doc(api_doc=admin_doc.roles)
    @login_required
    @permission_required
    def post(self):
        args_role = parse_role.parse_args()
        id = args_role.get('id')
        roles = json.loads(args_role.get('roles'))
        admin = get_admin(id)
        # 清空原来的roles
        old_data = AdminRole.query.filter_by(admin_id = admin.id ).all()
        if old_data :
            Crud.clean_all(old_data)
        # 如果有配置规则
        if roles:
            admin_roles = [AdminRole(
                admin_id = admin.id,
                role_id =v
            ) for v in roles ]
            Crud.add_all(admin_roles)
            admin.last_editor = g.admin.username
            admin.updata()
        return {
                    'status':RET.OK,
                    'msg':'角色设置成功'
                }
        
       
class AdminResource(Resource):
    @api.doc(api_doc=admin_doc.admin_list)
    @login_required
    @permission_required
    def get(self):
        '''
        获取用户信息
        '''
        args_id = parse_id.parse_args()
        id = args_id.get('id')
        if id:
            admin = get_admin(id)
            data = {
                        'status':RET.OK,
                        'data':object_to_json(admin)
                    }
            return data
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        sql = '''
        SELECT SQL_CALC_FOUND_ROWS a.id,a.username,a.name,a.phone,a.email,
        GROUP_CONCAT(r.name SEPARATOR ',') as roles_name,
		GROUP_CONCAT(ar.role_id SEPARATOR ',') as roles,
        l.create_time as last_login,
        l.ip as ip
        FROM admin as a
        left join admin_role as ar on a.id = ar.admin_id
        left join role as r on r.id = ar.role_id
        left join admin_log as l on l.username = a.username and l.create_time=(select max(create_time) from admin_log where username=a.username)
        WHERE a.is_del = 0
        GROUP BY a.id
        LIMIT {0},{1};
        '''.format((page-1)*paginate,paginate)
        sql_data = Crud.auto_select(sql)
        # 查询总数
        count_num = Crud.auto_select("SELECT FOUND_ROWS() as countnum")
        count = int((count_num.first()).countnum)
        fetchall_data = sql_data.fetchall()
        if not fetchall_data:
            abort(RET.NotFound,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'paginate':{
                        'page':page,
                        'per_page':paginate,
                        'total':count
                    },
                    'data':([mysql_to_json(dict(v))  for v in fetchall_data])
            }
        return data 
        


    @api.doc(api_doc=admin_doc.admin_add)
    @login_required
    @permission_required
    def post(self):
        '''
        添加用户
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
        admin.last_editor = g.admin.username
        if admin.add():
            data = {
                'status':RET.Created,
                'msg':'新增管理员成功',
                'data':admin
            }
            return marshal(data,sing_user_fields)
        abort(RET.BadRequest,msg='新增失败')

       
    # 重置密码
    @api.doc(api_doc=admin_doc.reset_pwd)
    @login_required
    @permission_required   
    def put(self):
        '''
        重置密码
        '''
        args_id = parse_id.parse_args()
        id = args_id.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        admin = get_admin(id)
        if admin.is_super == 1:
            abort(RET.BadRequest,msg='重置失败，超级管理员的密码不能重置!!!')
        admin.password = '123456a'
        if admin.updata():
            # 清除用户登录状态
            cache.delete(admin.id) 
            return  {
                'status':RET.OK,
                'msg':'重置密码成功',
                }
        abort(RET.BadRequest,msg='重置密码失败')

    @api.doc(api_doc=admin_doc.del_admin)      
    @login_required
    @permission_required 
    def delete(self):
        '''
        删除用户
        '''
        args_id = parse_id.parse_args()
        id = args_id.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        admin = get_admin(id)
        if not admin:
            abort(RET.BadRequest,msg='用户不存在!!!')
        if admin.is_super == 1:
            abort(RET.BadRequest,msg='删除失败，无法删除超级管理员!!!')
        admin.is_del = admin.id
        admin.last_editor = g.admin.username
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
    @api.doc(api_doc=admin_doc.login) 
    def post(self):
        '''
        登录
        '''
        args_login = parse_login.parse_args()
        password = args_login.get('password')
        username = args_login.get('username').lower()
        captcha = args_login.get('captcha')
        text = cache.get('image_code_%s'%args_login.get('image_code'))
        if not text:
            abort(RET.Forbidden,msg='验证码错误')
        if captcha.lower() != text.lower():
            abort(RET.Forbidden,msg='验证码错误')
        cache.delete('image_code_%s'%args_login.get('image_code')) 
        admin = Admin.query.filter_by(username = username,is_del='0').first()
        if not admin:
            abort(RET.BadRequest,msg='用户名或密码错误')
        if not admin.check_pwd(password):
            abort(RET.Unauthorized,msg='用户名或密码错误')
        token = Auth.encode_auth_token(admin.id)
        cache.set(admin.id,token,timeout=60*60*7)
        # 记录登陆日志
        admin_log = AdminLog()
        admin_log.username = admin.username
        admin_log.ip = request.remote_addr
        admin_log.add()
        data = {
            'status':RET.OK,
            'msg':'登录成功',
            'token':token
        }
        return data

    @api.doc(api_doc=admin_doc.logout)      
    @login_required 
    def delete(self):
        '''
        登出
        '''
        # admin = g.admin
        # cache.delete(admin.id) 
        logout()
        abort(RET.BadRequest,msg='已退出',status=RET.REENTRY)