#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-09 21:47:54
@LastEditTime : 2020-01-27 20:02:46
@LastEditors  : Xuannan
'''
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.blog import BlogCategory
from app.utils import object_to_json
from app.utils.tree import build_tree
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.blog import category_doc
from flask import g

api = Apidoc('博客-分类')


parse_id = reqparse.RequestParser()
parse_id.add_argument('id')

parse_base = parse_id.copy()
parse_base.add_argument('pid',type=str,required=True,help='请选择上级分类')
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

class BlogCategoryResource(Resource):
    @api.doc(api_doc=category_doc.add)
    @login_required
    @permission_required
    def post(self):
        '''
        添加分类
        '''
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
        blog_cate.last_editor = g.admin.username
        if blog_cate.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':blog_cate
            }
            return marshal(data,sing_cate_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

        

    @api.doc(api_doc=category_doc.lst)
    def get(self):
        '''
        获取分类树
        '''
        args = parse_id.parse_args()
        id = args.get('id')
        if  id:
            return {
                    'status':RET.OK,
                    'data':object_to_json(getCategory(id))
            } 
        cate_list = BlogCategory.query.filter_by(is_del = '0').order_by(BlogCategory.sort.desc()).all()
        if not cate_list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'data':build_tree(cate_list,'0',0)
            }
        return data 

       
    
    @api.doc(api_doc=category_doc.put)
    @login_required 
    @permission_required 
    def put(self):
        '''
        修改分类
        '''
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        blog_cate = getCategory(id)
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
        blog_cate.last_editor = g.admin.username
        result = BlogCategory().updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':blog_cate
            }
            return marshal(data,sing_cate_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')
        
    @api.doc(api_doc=category_doc.delete)
    @login_required
    @permission_required
    def delete(self):
        '''
        删除分类
        '''
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        cate = getCategory(id)
        cate.is_del = cate.id
        cate.last_editor = g.admin.username
        result = BlogCategory().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        