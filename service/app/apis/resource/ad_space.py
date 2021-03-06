
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models import AdSpace
from app.utils import object_to_json
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.resource import adspace_doc as doc
from flask import g
from app.config import PAGINATE_NUM

api = Apidoc('通用-广告位管理')


# 单数据操作
parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)

parse_base = parse_id.copy()
parse_base.add_argument('name',type=str,required=True,help='请输入名称')
parse_base.add_argument('ename',type=str,required=True,help='请输入调用名称')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')

_fields = {
    'name':fields.String,
    'ename':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(_fields)
}

def getSingData(id):
    data = AdSpace.query.filter_by(id = id , is_del = '0').first()
    if not data :
        abort(RET.NotFound,msg='广告位不存在')
    return data

class AdSpaceResource(Resource):
    @api.doc(api_doc=doc.add)
    @login_required
    @permission_required
    def post(self):
        '''
        添加
        '''
        args = parse_base.parse_args()
        name = args.get('name')
        ename = args.get('ename')
        sort = args.get('sort')
        _data = AdSpace.query.filter_by(ename = ename,is_del = '0').first()
        if _data:
            abort(RET.Forbidden,msg='广告位已存在')
        model_data = AdSpace()
        model_data.name = name
        model_data.ename = ename
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
        修改
        '''
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        sing_data = getSingData(id)
        name = args.get('name')
        ename = args.get('ename')
        sort = args.get('sort')
        # 如果名称存在，并且ID不是当前ID
        _data = AdSpace.query.filter(AdSpace.id != id , AdSpace.is_del == '0',AdSpace.ename == ename).first()
        if _data:
            abort(RET.Forbidden,msg='广告位已存在')
        sing_data.name = name
        sing_data.ename = ename
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
        获取列表
        '''
        args_id = parse_id.parse_args()
        id = args_id.get('id')
        if id:
            return {
                    'status':RET.OK,
                    'data':object_to_json(getSingData(id))
            } 
        _list = AdSpace.query.filter_by(is_del = '0').order_by(AdSpace.sort.desc()).all()
        if not _list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'data':[object_to_json(v) for v in _list]
            }
        return data 

    
    @api.doc(api_doc=doc.delete)
    @login_required
    @permission_required
    def delete(self):
        '''
        删除
        '''
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        sing_data = getSingData(id)
        sing_data.last_editor = g.admin.username
        result = sing_data.delete()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        