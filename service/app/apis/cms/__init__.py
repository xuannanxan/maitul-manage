#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:21:28
@LastEditTime : 2020-01-31 12:50:51
@LastEditors  : Xuannan
'''

from flask_restful import Api
from app.apis.cms.tag import TagResource
from app.apis.cms.category import CategoryResource
from app.apis.cms.content import ContentResource
from app.apis import api_blueprint

cms_api = Api(api_blueprint)
# tag
cms_api.add_resource(TagResource,'/cms/<site>/tag')
# category
cms_api.add_resource(CategoryResource,'/cms/<site>/category')
# content
cms_api.add_resource(ContentResource,'/cms/<site>/content')