#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-20 18:05:19
@LastEditTime : 2020-02-05 13:40:37
@LastEditors  : Xuannan
'''

from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models import Menu
from app.utils import object_to_json
from app.utils.tree import build_tree,getParent
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.admin import menu_doc as doc
from flask import g

api = Apidoc('系统-后台菜单配置')

# 单数据操作
parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)

parse_base = parse_id.copy()
parse_base.add_argument('pid',type=str,required=True,help='请选择上级菜单')
parse_base.add_argument('name',type=str,required=True,help='请输入名称')
parse_base.add_argument('url')
parse_base.add_argument('icon')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')

_fields = {
    'pid':fields.String,
    'name':fields.String,
    'url':fields.String,
    'icon':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(_fields)
}

def getSingData(id):
    data = Menu.query.filter_by(id = id , is_del = '0').first()
    if not data :
        abort(RET.NotFound,msg='菜单不存在')
    return data

class MenuResource(Resource):
    @api.doc(api_doc=doc.add)
    @login_required
    @permission_required
    def post(self):
        '''
        添加菜单
        '''
        args = parse_base.parse_args()
        pid = args.get('pid')
        name = args.get('name')
        url = args.get('url')
        icon = args.get('icon')
        sort = args.get('sort')
        _data = Menu.query.filter_by(name = name,is_del = '0').first()
        if _data:
            abort(RET.Forbidden,msg='菜单已存在')
        model_data = Menu()
        model_data.pid = pid
        model_data.name = name
        model_data.url = url
        model_data.icon = icon
        model_data.sort = sort
        model_data.last_editor = g.admin.username
        if model_data.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':model_data
            }
            return marshal(data,sing_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

    @api.doc(api_doc=doc.put)
    @login_required  
    @permission_required
    def put(self):
        '''
        修改菜单
        '''
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.Forbidden,msg='请勿非法操作')
        sing_data = getSingData(id)
        pid = args.get('pid')
        name = args.get('name')
        url = args.get('url')
        icon = args.get('icon')
        sort = args.get('sort')
        # 如果名称存在，并且ID不是当前ID
        _data = Menu.query.filter(Menu.id != id , Menu.is_del == '0',Menu.name == name).first()
        if _data:
            abort(RET.Forbidden,msg='菜单已存在')
        sing_data.name = name
        sing_data.pid = pid if pid else sing_data.pid
        sing_data.url = url if url else sing_data.url
        sing_data.icon = icon if icon else sing_data.icon
        sing_data.sort = sort if sort else sing_data.sort
        sing_data.last_editor = g.admin.username
        result = sing_data.updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':sing_data
            }
            return marshal(data,sing_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')

    @api.doc(api_doc=doc.lst)
    @login_required
    @permission_required
    def get(self):
        '''
        获取菜单树
        '''
        args_id = parse_id.parse_args()
        id = args_id.get('id')
        if id:
            return {
                        'status':RET.OK,
                        'data':object_to_json(getSingData(id))
                } 
        _list = Menu.query.filter_by(is_del = '0').order_by(Menu.sort.desc()).all()
        if not _list:
            abort(RET.BadRequest,msg='暂无数据')
        if g.admin.is_super==0:
            authMenus = getParent(_list,[v for v in _list if v.id in g.menus])
            _list = authMenus
        data = {
                    'status':RET.OK,
                    'data':build_tree(_list,'0',0)
            }
        return data  
 
        
    @api.doc(api_doc=doc.delete)
    @login_required
    @permission_required
    def delete(self):
        '''
        删除菜单
        '''
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.Forbidden,msg='请勿非法操作')
        sing_data = getSingData(id)
        sing_data.is_del = sing_data.id
        sing_data.last_editor = g.admin.username
        result = sing_data.delete()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')



