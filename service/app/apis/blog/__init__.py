#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:21:28
@LastEditTime : 2020-01-27 19:12:11
@LastEditors  : Xuannan
'''

from flask_restful import Api
from app.apis.blog.tag import BlogTagResource
from app.apis.blog.category import BlogCategoryResource
from app.apis.blog.content import BlogContentResource
from app.apis import api_blueprint

blog_api = Api(api_blueprint)
# tag
blog_api.add_resource(BlogTagResource,'/blog/tag')
# category
blog_api.add_resource(BlogCategoryResource,'/blog/category')
# content
blog_api.add_resource(BlogContentResource,'/blog/content')