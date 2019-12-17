#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-13 10:35:39
@LastEditTime: 2019-12-17 12:46:37
@LastEditors: Xuannan
'''
from flask_restful import Api
from app.apis.admin.admin import AdminResource,AdminLogin,AdminList,AdminCurrent,AdminAdd
from app.apis import api_blueprint

admin_api = Api(api_blueprint)
admin_api.add_resource(AdminAdd,'/admin/add')
admin_api.add_resource(AdminResource,'/admin/<id>')
admin_api.add_resource(AdminList,'/admin/list')
admin_api.add_resource(AdminLogin,'/login')
admin_api.add_resource(AdminCurrent,'/admin/current_user')