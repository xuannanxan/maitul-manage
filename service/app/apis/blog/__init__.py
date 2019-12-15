#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:21:28
@LastEditTime: 2019-12-15 22:59:22
@LastEditors: Xuannan
'''

from flask_restful import Api
from app.apis.blog.tag import BlogTagResource,BlogTagList,BlogTagAdd
from app.apis.blog.category import BlogCategoryResource,BlogCategoryTree,BlogCategoryAdd
from app.apis.blog.content import BlogContentAdd,BlogContentList,BlogContentResource
from app.apis import api_blueprint

blog_api = Api(api_blueprint)
# tag
blog_api.add_resource(BlogTagList,'/blog/tag/list')
blog_api.add_resource(BlogTagAdd,'/blog/tag')
blog_api.add_resource(BlogTagResource,'/blog/tag/<id>')
# category
blog_api.add_resource(BlogCategoryTree,'/blog/category/tree')
blog_api.add_resource(BlogCategoryAdd,'/blog/category')
blog_api.add_resource(BlogCategoryResource,'/blog/category/<id>')
# content
blog_api.add_resource(BlogContentAdd,'/blog/content')
blog_api.add_resource(BlogContentList,'/blog/content/list')
blog_api.add_resource(BlogContentResource,'/blog/content/<id>')