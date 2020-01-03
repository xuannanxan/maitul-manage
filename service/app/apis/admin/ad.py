
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.admin import Ad
from app.utils import object_to_json
from app.apis.admin.common import login_required
from app.utils.api_doc import Apidoc
from app.api_docs.admin import ad_doc as doc
from flask import g
from app.config import PAGINATE_NUM

api = Apidoc('广告管理')

# 单数据操作
parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)

parse_base = parse_id.copy()
parse_base.add_argument('space_id',type=str,required=True,help='请选择广告位')
parse_base.add_argument('name',type=str,required=True,help='请输入名称')
parse_base.add_argument('url',type=str)
parse_base.add_argument('info',type=str)
parse_base.add_argument('img',type=str,required=True,help='请上传图片')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')

parse_page = reqparse.RequestParser()
parse_page.add_argument('page',type=int,help='页码只能是数字')
parse_page.add_argument('paginate',type=int,help='每页数量只能是数字')

_fields = {
    'space_id':fields.String,
    'name':fields.String,
    'info':fields.String,
    'img':fields.String,
    'url':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(_fields)
}

def getSingData(id):
    data = Ad.query.filter_by(id = id , is_del = '0').first()
    if not data :
        abort(RET.NotFound,msg='广告位不存在')
    return data

class AdResource(Resource):
    @api.doc(api_doc=doc.add)
    @login_required
    def post(self):
        '''
        添加
        '''
        args = parse_base.parse_args()
        space_id = args.get('space_id')
        url = args.get('url')
        info = args.get('info')
        img = args.get('img')
        name = args.get('name')
        sort = args.get('sort')
        model_data = Ad()
        model_data.space_id = space_id
        model_data.img = img
        model_data.url = url
        model_data.info = info
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
        space_id = args.get('space_id')
        url = args.get('url')
        info = args.get('info')
        img = args.get('img')
        name = args.get('name')
        sort = args.get('sort')
        sing_data.name = name
        sing_data.sort = sort if sort else sing_data.sort
        sing_data.space_id = space_id if space_id else sing_data.space_id
        sing_data.url = url if url else sing_data.url
        sing_data.info = info if info else sing_data.info
        sing_data.img = img if img else sing_data.img
        sing_data.last_editor = g.admin.username
        result = Ad().updata()
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
        获取列表
        '''
        args_id = parse_id.parse_args()
        id = args_id.get('id')
        if id:
            return {
                        'status':RET.OK,
                        'data':object_to_json(getSingData(id))
                } 
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        _list = Ad.query.filter_by(is_del = '0').order_by(Ad.sort.desc()).paginate(page, paginate, False)
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

    
        
    @api.doc(api_doc=doc.delete)
    @login_required
    def delete(self,id):
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
        result = Ad().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        