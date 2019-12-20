
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.admin import AdSpace
from app.utils import object_to_json
from app.apis.admin.common import login_required
from app.utils.api_doc import Apidoc
from app.api_docs.admin import adspace_doc as doc
from flask import g
from app.config import PAGINATE_NUM

api = Apidoc('广告位管理')


parse_base = reqparse.RequestParser()
parse_base.add_argument('name',type=str,required=True,help='请输入名称')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')

parse_page = reqparse.RequestParser()
parse_page.add_argument('page',type=int,help='页码只能是数字')
parse_page.add_argument('paginate',type=int,help='每页数量只能是数字')

_fields = {
    'name':fields.String,
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

class AdSpaceAdd(Resource):
    @api.doc(api_doc=doc.add)
    @login_required
    def post(self):
        '''
        添加
        '''
        args = parse_base.parse_args()
        name = args.get('name')
        sort = args.get('sort')
        _data = AdSpace.query.filter_by(name = name,is_del = '0').first()
        if _data:
            abort(RET.Forbidden,msg='广告位已存在')
        model_data = AdSpace()
        model_data.name = name
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

        
class AdSpaceList(Resource):
    @api.doc(api_doc=doc.lst)
    @login_required
    def get(self):
        '''
        获取列表
        '''
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        _list = AdSpace.query.filter_by(is_del = '0').order_by(AdSpace.sort.desc()).paginate(page, paginate, False)
        if not _list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'paginate':{
                        'page':_list.page,
                        'per_page':_list.per_page,
                        'total':_list.total
                    },
                    'data':[object_to_json(v) for v in _list.items]
            }
        return data 

    

class AdSpaceResource(Resource):
    @api.doc(api_doc=doc.get)
    @login_required
    def get(self,id):
        '''
        单个
        '''
        return {
                    'status':RET.OK,
                    'data':object_to_json(getSingData(id))
            } 
    
    @api.doc(api_doc=doc.put)
    @login_required  
    def put(self,id):
        '''
        修改
        '''
        sing_data = getSingData(id)
        args = parse_base.parse_args()
        name = args.get('name')
        sort = args.get('sort')
        # 如果名称存在，并且ID不是当前ID
        _data = AdSpace.query.filter(AdSpace.id != id , AdSpace.is_del == '0',AdSpace.name == name).first()
        if _data:
            abort(RET.Forbidden,msg='广告位已存在')
        sing_data.name = name
        sing_data.sort = sort if sort else sing_data.sort
        sing_data.last_editor = g.admin.username
        result = AdSpace().updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':sing_data
            }
            return marshal(data,sing_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')
        
    @api.doc(api_doc=doc.delete)
    @login_required
    def delete(self,id):
        '''
        删除
        '''
        sing_data = getSingData(id)
        sing_data.is_del = sing_data.id
        sing_data.last_editor = g.admin.username
        result = AdSpace().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        