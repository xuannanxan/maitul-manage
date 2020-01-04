#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-13 10:35:39
@LastEditTime : 2020-01-04 20:19:07
@LastEditors  : Xuannan
'''
from flask_restful import Api
from app.apis.admin.admin import AdminResource,AdminLogin,AdminCurrent
from app.apis.admin.menu import MenuResource
from app.apis.admin.ad_space import AdSpaceResource
from app.apis.admin.ad import AdResource
from app.apis.admin.rule import RuleResource
from app.apis.admin.role import RoleResource
from app.apis.admin.uploads import UploadResource
from app.apis import api_blueprint


admin_api = Api(api_blueprint)
# 用户和登录
admin_api.add_resource(AdminResource,'/admin')
admin_api.add_resource(AdminLogin,'/login')
admin_api.add_resource(AdminCurrent,'/admin/current_user')

# 菜单
admin_api.add_resource(MenuResource,'/admin/menu')

# 权限规则
admin_api.add_resource(RuleResource,'/admin/rule')

# 角色
admin_api.add_resource(RoleResource,'/admin/role')

# 广告位
admin_api.add_resource(AdSpaceResource,'/admin/adspace')

# 广告
admin_api.add_resource(AdResource,'/admin/ad')
# 上传
admin_api.add_resource(UploadResource,'/upload')