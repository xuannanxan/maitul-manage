#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:28:32
@LastEditTime: 2020-03-24 15:15:45
@LastEditors: Xuannan
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
parse_base.add_argument('lang')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')


tag_fields = {
    'name':fields.String,
    'lang':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_tag_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(tag_fields)
}


def getTag(id,tagModel):
    tag = tagModel.query.filter_by(id = id , is_del = '0').first()
    if not tag :
        abort(RET.NotFound,msg='标签不存在')
    return tag

def setModel(site):
    if site == 'blog':
        return BlogTag
    elif site == 'maitul':
        return MaitulTag
    elif site == 'info':
        return InfoTag
    elif site == 'metalparts':
        return MetalpartsTag
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
        tagModel = setModel(site)
        args = parse_base.parse_args()
        name = args.get('name')
        sort = args.get('sort')
        lang = args.get('lang')
        tag = tagModel.query.filter_by(name = name,is_del = '0').first()
        if tag:
            abort(RET.Forbidden,msg='标签已存在')
        tag_model = tagModel()
        tag_model.name = name
        tag_model.sort = sort
        tag_model.lang = lang
        tag_model.last_editor = g.admin.username
        if tag_model.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':tag_model
            }
            return marshal(data,sing_tag_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')


    @api.doc(api_doc=tag_doc.lst)
    @login_required
    @permission_required
    def get(self,site):
        '''
        标签列表
        '''
        tagModel = setModel(site)
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
        tagModel = setModel(site)
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        name = args.get('name')
        lang = args.get('lang')
        sort = args.get('sort')
        tagData = getTag(id,tagModel)
        # 如果名称存在，并且ID不是当前ID
        tag = tagModel.query.filter(tagModel.id != id , tagModel.is_del == '0',tagModel.name == name).first()
        if tag:
            abort(RET.Forbidden,msg='标签已存在')
        tagData.name = name
        tagData.lang = lang
        tagData.sort = sort if sort else blog_tag.sort
        tagData.last_editor = g.admin.username
        result = tagData.updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':tagData
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
        tagModel = setModel(site)
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        tag = getTag(id,tagModel)
        tag.last_editor = g.admin.username
        result = tag.delete()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        