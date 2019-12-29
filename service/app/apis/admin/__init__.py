#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-13 10:35:39
@LastEditTime : 2019-12-28 22:05:16
@LastEditors  : Xuannan
'''
from flask_restful import Api
from app.apis.admin.admin import AdminResource,AdminLogin,AdminList,AdminCurrent,AdminAdd
from app.apis.admin.menu import MenuResource,MenuAdd,MenuTree
from app.apis.admin.ad_space import AdSpaceAdd,AdSpaceList,AdSpaceResource
from app.apis.admin.ad import AdAdd,AdList,AdResource
from app.apis.admin.uploads import UploadResource
from app.apis import api_blueprint


admin_api = Api(api_blueprint)
# 用户和登录
admin_api.add_resource(AdminAdd,'/admin/add')
admin_api.add_resource(AdminResource,'/admin/<id>')
admin_api.add_resource(AdminList,'/admin/list')
admin_api.add_resource(AdminLogin,'/login')
admin_api.add_resource(AdminCurrent,'/admin/current_user')

# 菜单
admin_api.add_resource(MenuTree,'/admin/menu/tree')
admin_api.add_resource(MenuAdd,'/admin/menu')
admin_api.add_resource(MenuResource,'/admin/menu/<id>')

# 广告位
admin_api.add_resource(AdSpaceList,'/admin/adspace/list')
admin_api.add_resource(AdSpaceAdd,'/admin/adspace')
admin_api.add_resource(AdSpaceResource,'/admin/adspace/<id>')

# 广告
admin_api.add_resource(AdList,'/admin/ad/list')
admin_api.add_resource(AdAdd,'/admin/ad')
admin_api.add_resource(AdResource,'/admin/ad/<id>')
# 上传
admin_api.add_resource(UploadResource,'/upload')