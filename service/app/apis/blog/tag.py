#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:28:32
@LastEditTime: 2019-12-18 16:47:59
@LastEditors: Xuannan
'''
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.blog import BlogTag
from app.utils import object_to_json
from app.config import PAGINATE_NUM
from app.apis.admin.common import login_required
from app.utils.api_doc import Apidoc
from app.api_docs.blog import tag_doc
from flask import g

api = Apidoc('博客标签')

parse_base = reqparse.RequestParser()
parse_base.add_argument('name',type=str,required=True,help='请输入标签名称')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')

parse_page = reqparse.RequestParser()
parse_page.add_argument('page',type=int,help='页码只能是数字')
parse_page.add_argument('paginate',type=int,help='每页数量只能是数字')

tag_fields = {
    'name':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_tag_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(tag_fields)
}
def getTag(id):
    tag = BlogTag.query.filter_by(id = id , is_del = '0').first()
    if not tag :
        abort(RET.NotFound,msg='标签不存在')
    return tag

class BlogTagAdd(Resource):
    @api.doc(api_doc=tag_doc.add)
    @login_required
    def post(self):
        """
        添加标签
        """
        args = parse_base.parse_args()
        name = args.get('name')
        sort = args.get('sort')
        tag = BlogTag.query.filter_by(name = name,is_del = '0').first()
        if tag:
            abort(RET.Forbidden,msg='标签已存在')
        blog_tag = BlogTag()
        blog_tag.name = name
        blog_tag.sort = sort
        blog_tag.last_editor = g.admin.username
        if blog_tag.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':blog_tag
            }
            return marshal(data,sing_tag_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

class BlogTagList(Resource):
    @api.doc(api_doc=tag_doc.lst)
    def get(self):
        '''
        标签列表
        '''
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        tag_list = BlogTag.query.filter_by(is_del = '0').order_by(BlogTag.sort.desc()).paginate(page, paginate, False)
        if not tag_list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'paginate':{
                        'page':tag_list.page,
                        'per_page':tag_list.per_page,
                        'total':tag_list.total
                    },
                    'data':[object_to_json(v) for v in tag_list.items]
            }
        return data 

    

class BlogTagResource(Resource):
    @api.doc(api_doc=tag_doc.get)
    def get(self,id):
        '''
        单个标签
        '''
        return {
                    'status':RET.OK,
                    'data':object_to_json(getTag(id))
            } 
    
    @api.doc(api_doc=tag_doc.put)
    @login_required    
    def put(self,id):
        '''
        修改标签
        '''
        blog_tag = getTag(id)
        args = parse_base.parse_args()
        name = args.get('name')
        sort = args.get('sort')
        # 如果名称存在，并且ID不是当前ID
        tag = BlogTag.query.filter(BlogTag.id != id , BlogTag.is_del == '0',BlogTag.name == name).first()
        if tag:
            abort(RET.Forbidden,msg='标签已存在')
        if name:
            blog_tag.name = name
        if sort:
            blog_tag.sort = sort
        blog_tag.last_editor = g.admin.username
        result = BlogTag().updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':blog_tag
            }
            return marshal(data,sing_tag_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')

    @api.doc(api_doc=tag_doc.delete)
    @login_required
    def delete(self,id):
        '''
        删除标签
        '''
        tag = getTag(id)
        tag.is_del = tag.id
        tag.last_editor = g.admin.username
        result = BlogTag().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        