#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-13 10:35:39
@LastEditTime: 2020-03-23 11:35:45
@LastEditors: Xuannan
'''
from flask_restful import Api
from app.apis.admin.admin import AdminResource,AdminLogin,AdminCurrent,AdminAuth
from app.apis.admin.menu import MenuResource
from app.apis.admin.rule import RuleResource
from app.apis.admin.role import RoleResource,RoleAuthResource
from app.apis.admin.config import WebConfigResource,ConfigResource
from app.apis.admin.lang import LangResource
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

# 配置项
admin_api.add_resource(WebConfigResource,'/webconfig')
admin_api.add_resource(ConfigResource,'/admin/config')

# 语言
admin_api.add_resource(LangResource,'/admin/lang')