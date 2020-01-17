#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-13 10:35:39
@LastEditTime : 2020-01-17 10:36:55
@LastEditors  : Xuannan
'''
from flask_restful import Api
from app.apis.admin.admin import AdminResource,AdminLogin,AdminCurrent,AdminAuth
from app.apis.admin.menu import MenuResource
from app.apis.admin.rule import RuleResource
from app.apis.admin.role import RoleResource,RoleAuthResource
from app.apis import api_blueprint


admin_api = Api(api_blueprint)
# 用户和登录
admin_api.add_resource(AdminResource,'/admin')
admin_api.add_resource(AdminLogin,'/login')
admin_api.add_resource(AdminCurrent,'/admin/current_user')
admin_api.add_resource(AdminAuth,'/admin/auth')

# 菜单
admin_api.add_resource(MenuResource,'/admin/menu')

# 权限规则
admin_api.add_resource(RuleResource,'/admin/rule')

# 角色
admin_api.add_resource(RoleResource,'/admin/role')
admin_api.add_resource(RoleAuthResource,'/admin/role/auth')
