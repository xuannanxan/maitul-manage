#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-09 21:47:54
@LastEditTime: 2019-12-17 17:22:08
@LastEditors: Xuannan
'''
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.blog import BlogCategory
from app.utils import object_to_json
from app.utils.tree import build_tree
from app.apis.admin.common import login_required
from flasgger import swag_from

parse_base = reqparse.RequestParser()
parse_base.add_argument('pid')
parse_base.add_argument('name',type=str,required=True,help='请输入分类名称')
parse_base.add_argument('keywords')
parse_base.add_argument('description')
parse_base.add_argument('icon')
parse_base.add_argument('cover')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')

cate_fields = {
    'pid':fields.String,
    'name':fields.String,
    'keywords':fields.String,
    'description':fields.String,
    'icon':fields.String,
    'cover':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_cate_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(cate_fields)
}

def getCategory(id):
    category = BlogCategory.query.filter_by(id = id , is_del = '0').first()
    if not category :
        abort(RET.NotFound,msg='分类不存在')
    return category

class BlogCategoryAdd(Resource):
    @login_required
    def post(self):
        args = parse_base.parse_args()
        pid = args.get('pid')
        name = args.get('name')
        keywords = args.get('keywords')
        description = args.get('description')
        icon = args.get('icon')
        cover = args.get('cover')
        sort = args.get('sort')
        cate = BlogCategory.query.filter_by(name = name,is_del = '0').first()
        if cate:
            abort(RET.Forbidden,msg='分类已存在')
        blog_cate = BlogCategory()
        blog_cate.pid = pid
        blog_cate.name = name
        blog_cate.keywords = keywords
        blog_cate.description = description
        blog_cate.icon = icon
        blog_cate.cover = cover
        blog_cate.sort = sort
        if blog_cate.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':blog_cate
            }
            return marshal(data,sing_cate_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

        
class BlogCategoryTree(Resource):
    def get(self):
        '''
        file: yml/category/list.yml
        '''
        cate_list = BlogCategory.query.filter_by(is_del = '0').order_by(BlogCategory.sort.desc()).all()
        if not cate_list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'data':build_tree(cate_list,'0',0)
            }
        return data 

    

class BlogCategoryResource(Resource):
    def get(self,id):
        '''
        file: yml/category/get.yml
        '''
        return {
                    'status':RET.OK,
                    'data':object_to_json(getCategory(id))
            } 
    
    @login_required    
    def put(self,id):
        '''
        file: yml/category/put.yml
        '''
        blog_cate = getCategory(id)
        args = parse_base.parse_args()
        pid = args.get('pid')
        name = args.get('name')
        keywords = args.get('keywords')
        description = args.get('description')
        icon = args.get('icon')
        cover = args.get('cover')
        sort = args.get('sort')
        # 如果名称存在，并且ID不是当前ID
        cate = BlogCategory.query.filter(BlogCategory.id != id , BlogCategory.is_del == '0',BlogCategory.name == name).first()
        if cate:
            abort(RET.Forbidden,msg='标签已存在')
        blog_cate.name = name
        blog_cate.pid = pid if pid else blog_cate.pid
        blog_cate.keywords = keywords if keywords else blog_cate.keywords
        blog_cate.description = description if description else blog_cate.description
        blog_cate.icon = icon if icon else blog_cate.icon
        blog_cate.cover = cover if cover else blog_cate.cover
        blog_cate.sort = sort if sort else blog_cate.sort
        result = BlogCategory().updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':blog_cate
            }
            return marshal(data,sing_cate_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')
        
    @login_required
    def delete(self,id):
        '''
        file: yml/category/del.yml
        '''
        cate = getCategory(id)
        cate.is_del = cate.id
        result = BlogCategory().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        