#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-20 18:05:19
@LastEditTime: 2020-03-27 17:01:34
@LastEditors: Xuannan
'''

from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models import WebConfig
from app.utils import object_to_json
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.admin import conf_doc as doc
from flask import g ,request
import json
from sqlalchemy import or_,and_

api = Apidoc('系统-配置项')

# 单数据操作
parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)
parse_id.add_argument('site',type=str)

parse_base = parse_id.copy()
parse_base.add_argument('site',type=str,required=True,help='请选择所属模块')
parse_base.add_argument('name',type=str,required=True,help='请输入名称')
parse_base.add_argument('ename',type=str,required=True,help='请输入调用名称')
parse_base.add_argument('fieldType',type=str,required=True,help='请选择字段类型')
parse_base.add_argument('placeholder')
parse_base.add_argument('values')
parse_base.add_argument('value')
parse_base.add_argument('lang')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')


parse_conf = reqparse.RequestParser()
parse_conf.add_argument('data',location='json')

_fields = {
    'site':fields.String,
    'name':fields.String,
    'ename':fields.String,
    'lang':fields.String,
    'fieldType':fields.String,
    'placeholder':fields.String,
    'values':fields.String,
    'value':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(_fields)
}

def getSingData(id):
    data = WebConfig.query.filter_by(id = id , is_del = '0').first()
    if not data :
        abort(RET.NotFound,msg='配置项不存在')
    return data

class ConfigResource(Resource):
    @api.doc(api_doc=doc.add)
    @login_required
    @permission_required
    def post(self):
        '''
        添加配置项
        '''
        args = parse_base.parse_args()
        site = args.get('site')
        name = args.get('name')
        ename = args.get('ename')
        fieldType = args.get('fieldType')
        placeholder = args.get('placeholder')
        values = args.get('values')
        value = args.get('value')
        sort = args.get('sort')
        lang = args.get('lang')
        _data = WebConfig.query.filter(
            WebConfig.is_del == '0',
            WebConfig.ename == ename,
            WebConfig.site == site,
            or_(WebConfig.lang == lang,WebConfig.lang == 'common',WebConfig.lang == None)).first()
        if _data:
            abort(RET.Forbidden,msg='配置项已存在')
        model_data = WebConfig()
        model_data.site = site
        model_data.name = name
        model_data.ename = ename
        model_data.fieldType = fieldType
        model_data.placeholder = placeholder
        model_data.values = values
        model_data.value = value
        model_data.sort = sort
        model_data.lang = lang
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
        修改配置项
        '''
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.Forbidden,msg='请勿非法操作')
        sing_data = getSingData(id)
        site = args.get('site')
        name = args.get('name')
        ename = args.get('ename')
        fieldType = args.get('fieldType')
        placeholder = args.get('placeholder')
        values = args.get('values')
        value = args.get('value')
        sort = args.get('sort')
        lang = args.get('lang')
        # 如果名称存在，并且ID不是当前ID
        _data = WebConfig.query.filter(
            WebConfig.id != id ,
            WebConfig.is_del == '0',
            WebConfig.ename == ename,
            WebConfig.site == site,
            or_(WebConfig.lang == lang,WebConfig.lang == 'common',WebConfig.lang == None)).first()
        if _data:
            abort(RET.Forbidden,msg='配置项已存在')
        sing_data.ename = ename
        sing_data.name = name
        sing_data.site = site
        sing_data.lang = lang
        sing_data.fieldType = fieldType
        sing_data.placeholder = placeholder if placeholder else sing_data.placeholder
        sing_data.values = values if values else sing_data.values
        sing_data.value = value if value else sing_data.value
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
        获取配置列表
        '''
        list_by_menu = {}
        _list = WebConfig.query.filter_by(is_del = '0').order_by(WebConfig.sort.desc()).all()
        if not _list:
            abort(RET.BadRequest,msg='暂无数据')
        for v in _list:
            if v.site in list_by_menu.keys():
                list_by_menu[v.site].append(object_to_json(v))
            else:
                list_by_menu[v.site] = [object_to_json(v)] 
        data = {
                    'status':RET.OK,
                    'data':list_by_menu
            }
        return data  
 
        
    @api.doc(api_doc=doc.delete)
    @login_required
    @permission_required
    def delete(self):
        '''
        删除配置项
        '''
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.Forbidden,msg='请勿非法操作')
        sing_data = getSingData(id)
        sing_data.last_editor = g.admin.username
        result = sing_data.delete()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')


class WebConfigResource(Resource):
    @api.doc(api_doc=doc.lst)
    @login_required
    @permission_required
    def get(self):
        '''
        获取配置列表
        '''
        args_id = parse_id.parse_args()
        site = args_id.get('site')
        _list = WebConfig.query.filter_by(is_del = '0',site=site).order_by(WebConfig.sort.desc()).all()
        if not _list:
            abort(RET.BadRequest,msg='暂无数据')
        configData = {}
        for v in _list:
            configData[v.ename] = v.value
        data = {
                    'status':RET.OK,
                    'data':configData
            }
        return data  


    @api.doc(api_doc=doc.put)
    @login_required  
    @permission_required
    def put(self):
        '''
        修改配置项
        '''
        args = parse_conf.parse_args()
        data = json.loads(json.dumps(eval(args.get('data'))))
        _list = WebConfig.query.filter_by(is_del = '0').order_by(WebConfig.sort.desc()).all()
        for v in _list:
            # 加|区分站点，因为调用名称要多站复用
            if data.get(v.site+'|'+(v.lang if v.lang else 'null')+'|'+v.ename):
                v.value = data.get(v.site+'|'+(v.lang if v.lang else 'null')+'|'+v.ename)
        result = WebConfig().updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'保存成功'
            }
            return data
        abort(RET.BadRequest,msg='保存失败，请重试')
