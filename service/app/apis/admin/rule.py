
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.admin import Rule
from app.utils import object_to_json
from app.apis.admin.common import login_required
from app.utils.api_doc import Apidoc
from app.api_docs.admin import rule_doc as doc
from flask import g
from app.config import PAGINATE_NUM

api = Apidoc('权限规则管理')

# 单数据操作
parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)

parse_base = parse_id.copy()
parse_base.add_argument('name',type=str,required=True,help='请输入名称')
parse_base.add_argument('url',type=str,required=True,help='请输入URL')
parse_base.add_argument('menu_id',type=str,required=True,help='所属菜单不能为空')
parse_base.add_argument('method',type=str,required=True,help='请求方法不能为空')


_fields = {
    'name':fields.String,
    'url':fields.String,
    'menu_id':fields.String,
    'id':fields.String,
    'method':fields.String
}
sing_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(_fields)
}

def getSingData(id):
    data = Rule.query.filter_by(id = id , is_del = '0').first()
    if not data :
        abort(RET.NotFound,msg='权限规则不存在')
    return data

class RuleResource(Resource):
    @api.doc(api_doc=doc.add)
    @login_required
    def post(self):
        '''
        添加
        '''
        args = parse_base.parse_args()
        name = args.get('name')
        url = args.get('url')
        menu_id = args.get('menu_id')
        method = args.get('method')
        # 权限规则名称可以重复，但是URL&请求方法不能重复
        _data = Rule.query.filter_by(url = url,method=method,is_del = '0').first()
        if _data:
            abort(RET.Forbidden,msg='权限规则已存在')
        model_data = Rule()
        model_data.name = name
        model_data.url = url
        model_data.menu_id = menu_id
        model_data.method = method
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
    def put(self):
        '''
        修改
        '''
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        sing_data = getSingData(id)
        name = args.get('name')
        url = args.get('url')
        menu_id = args.get('menu_id')
        method = args.get('method')
        # 如果名称存在，并且ID不是当前ID
        _data = Rule.query.filter(Rule.id != id , Rule.is_del == '0',Rule.url == url,Rule.method==method).first()
        if _data:
            abort(RET.Forbidden,msg='权限规则已存在')
        sing_data.name = name
        sing_data.url = url if url else sing_data.url
        sing_data.menu_id = menu_id if menu_id else sing_data.menu_id
        sing_data.method = method if method else sing_data.method
        sing_data.last_editor = g.admin.username
        result = Rule().updata()
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
    def get(self):
        '''
        获取数据，如果有ID就是单个数据，没有就是全部数据
        '''
        args_id = parse_id.parse_args()
        id = args_id.get('id')
        if id:
            return {
                        'status':RET.OK,
                        'data':object_to_json(getSingData(id))
                } 
        _list = Rule.query.filter_by(is_del = '0').all()
        if not _list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'data':[object_to_json(v) for v in _list]
            }
        return data 

 
    @api.doc(api_doc=doc.delete)
    @login_required
    def delete(self):
        '''
        删除
        '''
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        sing_data = getSingData(id)
        sing_data.is_del = sing_data.id
        sing_data.last_editor = g.admin.username
        result = Rule().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        