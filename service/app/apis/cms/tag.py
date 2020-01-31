#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:28:32
@LastEditTime : 2020-01-31 14:37:11
@LastEditors  : Xuannan
'''
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.utils import object_to_json
from app.config import PAGINATE_NUM
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.cms import tag_doc
from flask import g

from app.models import BlogTag,  MaitulTag, MetalpartsTag,InfoTag


api = Apidoc('内容管理-标签')

parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)

parse_base = parse_id.copy()
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

tagModel = ''
def getTag(id):
    tag = tagModel.query.filter_by(id = id , is_del = '0').first()
    if not tag :
        abort(RET.NotFound,msg='标签不存在')
    return tag

def setModel(site):
    global tagModel
    if site == 'blog':
        tagModel = BlogTag
    elif site == 'maitul':
        tagModel = MaitulTag
    elif site == 'info':
        tagModel = InfoTag
    elif site == 'metalparts':
        tagModel = MetalpartsTag
    else:
        abort(RET.NotFound,msg='请勿非法操作...')


class TagResource(Resource):
    @api.doc(api_doc=tag_doc.add)
    @login_required
    @permission_required
    def post(self,site):
        """
        添加标签
        """
        setModel(site)
        args = parse_base.parse_args()
        name = args.get('name')
        sort = args.get('sort')
        tag = tagModel.query.filter_by(name = name,is_del = '0').first()
        if tag:
            abort(RET.Forbidden,msg='标签已存在')
        blog_tag = tagModel()
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


    @api.doc(api_doc=tag_doc.lst)
    def get(self,site):
        '''
        标签列表
        '''
        setModel(site)
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
            tag_list = tagModel.query.filter_by(is_del = '0').order_by(tagModel.sort.desc(),tagModel.create_time.desc()).paginate(page, paginate, False)
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
        tag_list = tagModel.query.filter_by(is_del = '0').order_by(tagModel.sort.desc(),tagModel.create_time.desc()).all()
        if not tag_list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'data':[object_to_json(v) for v in tag_list]
            }
        return data 

    
    @api.doc(api_doc=tag_doc.put)
    @login_required 
    @permission_required   
    def put(self,site):
        '''
        修改标签
        '''
        setModel(site)
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        name = args.get('name')
        sort = args.get('sort')
        blog_tag = getTag(id)
        # 如果名称存在，并且ID不是当前ID
        tag = tagModel.query.filter(tagModel.id != id , tagModel.is_del == '0',tagModel.name == name).first()
        if tag:
            abort(RET.Forbidden,msg='标签已存在')
        blog_tag.name = name
        blog_tag.sort = sort if sort else blog_tag.sort
        blog_tag.last_editor = g.admin.username
        result = tagModel().updata()
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
    @permission_required
    def delete(self,site):
        '''
        删除标签
        '''
        setModel(site)
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        tag = getTag(id)
        tag.is_del = tag.id
        tag.last_editor = g.admin.username
        result = tagModel().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        