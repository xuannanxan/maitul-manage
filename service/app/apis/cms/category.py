#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-09 21:47:54
@LastEditTime: 2020-03-29 18:25:11
@LastEditors: Xuannan
'''
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.utils import object_to_json
from app.utils.tree import build_tree
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.cms import category_doc
from flask import g
from sqlalchemy import or_,and_
from app.models import BlogCategory,MaitulCategory,MetalpartsCategory,InfoCategory


api = Apidoc('内容管理-分类')


parse_id = reqparse.RequestParser()
parse_id.add_argument('id')

parse_base = parse_id.copy()
parse_base.add_argument('pid',type=str,required=True,help='请选择上级分类')
parse_base.add_argument('name',type=str,required=True,help='请输入分类名称')
parse_base.add_argument('keywords')
parse_base.add_argument('description')
parse_base.add_argument('icon')
parse_base.add_argument('cover')
parse_base.add_argument('module')
parse_base.add_argument('lang')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')

cate_fields = {
    'pid':fields.String,
    'name':fields.String,
    'keywords':fields.String,
    'description':fields.String,
    'icon':fields.String,
    'cover':fields.String,
    'module':fields.String,
    'sort':fields.Integer,
    'lang':fields.String,
    'id':fields.String
}
sing_cate_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(cate_fields)
}



def getCategory(id,categoryModel):
    category = categoryModel.query.filter_by(id = id , is_del = '0').first()
    if not category :
        abort(RET.NotFound,msg='分类不存在')
    return category
 
def setModel(site):
    if site == 'blog':
        return BlogCategory
    elif site == 'maitul':
        return MaitulCategory
    elif site == 'info':
        return InfoCategory
    elif site == 'metalparts':
        return MetalpartsCategory
    else:
        abort(RET.NotFound,msg='请勿非法操作...')
    

class CategoryResource(Resource):
    @api.doc(api_doc=category_doc.add)
    @login_required
    @permission_required
    def post(self,site):
        '''
        添加分类
        '''
        categoryModel = setModel(site)
        args = parse_base.parse_args()
        pid = args.get('pid')
        name = args.get('name')
        keywords = args.get('keywords')
        description = args.get('description')
        icon = args.get('icon')
        cover = args.get('cover')
        sort = args.get('sort')
        lang = args.get('lang')
        module = args.get('module')
        cate = categoryModel.query.filter(
            categoryModel.is_del == '0',
            categoryModel.name == name ,
            or_(categoryModel.lang == lang,categoryModel.lang == 'common',categoryModel.lang == None)).first()
        if cate:
            abort(RET.Forbidden,msg='分类已存在')
        cateData = categoryModel()
        cateData.pid = pid
        cateData.name = name
        cateData.keywords = keywords
        cateData.description = description
        cateData.icon = icon
        cateData.cover = cover
        cateData.sort = sort
        cateData.module = module
        cateData.lang = lang
        cateData.last_editor = g.admin.username
        if cateData.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':cateData
            }
            return marshal(data,sing_cate_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

        

    @api.doc(api_doc=category_doc.lst)
    @login_required
    @permission_required
    def get(self,site):
        '''
        获取分类树
        '''
        categoryModel = setModel(site)
        args = parse_id.parse_args()
        id = args.get('id')
        if  id:
            return {
                    'status':RET.OK,
                    'data':object_to_json(getCategory(id,categoryModel))
            } 
        cate_list = categoryModel.query.filter_by(is_del = '0').order_by(categoryModel.sort.desc()).all()
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
    def put(self,site):
        '''
        修改分类
        '''
        categoryModel = setModel(site)
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        cateData = getCategory(id,categoryModel)
        pid = args.get('pid')
        name = args.get('name')
        keywords = args.get('keywords')
        description = args.get('description')
        icon = args.get('icon')
        cover = args.get('cover')
        lang = args.get('lang')
        sort = args.get('sort')
        module = args.get('module')
        # 如果名称存在，并且ID不是当前ID
        cate = categoryModel.query.filter(
            categoryModel.id != id ,
            categoryModel.is_del == '0',
            categoryModel.name == name ,
            or_(categoryModel.lang == lang,categoryModel.lang == 'common',categoryModel.lang == None)).first()
        if cate:
            abort(RET.Forbidden,msg='分类已存在')
        cateData.name = name
        cateData.lang = lang
        cateData.pid = pid if pid else cateData.pid
        cateData.keywords = keywords if keywords else cateData.keywords
        cateData.description = description if description else cateData.description
        cateData.icon = icon if icon else cateData.icon
        cateData.cover = cover if cover else cateData.cover
        cateData.sort = sort if sort else cateData.sort
        cateData.module = module if module else cateData.module
        cateData.last_editor = g.admin.username
        result = cateData.updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':cateData
            }
            return marshal(data,sing_cate_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')
        
    @api.doc(api_doc=category_doc.delete)
    @login_required
    @permission_required
    def delete(self,site):
        '''
        删除分类
        '''
        categoryModel = setModel(site)
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        cate = getCategory(id,categoryModel)
        cate.last_editor = g.admin.username
        result = cate.delete()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        