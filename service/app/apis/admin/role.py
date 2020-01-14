
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.admin import Role,RoleRule
from app.models.base import Crud
from app.utils import object_to_json,mysql_to_json
from app.apis.admin.common import login_required
from app.utils.api_doc import Apidoc
from app.api_docs.admin import role_doc as doc
from flask import g
from app.config import PAGINATE_NUM
import json

api = Apidoc('角色管理')

# 单数据操作
parse_id = reqparse.RequestParser()
parse_id.add_argument('id',type=str)

parse_base = parse_id.copy()
parse_base.add_argument('name',type=str,required=True,help='请输入名称')
parse_base.add_argument('info',type=str)

parse_rules = parse_id.copy()
parse_rules.add_argument('rules',type=str,required=True,help='请配置权限')



_fields = {
    'name':fields.String,
    'info':fields.String,
    'id':fields.String,
}
sing_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(_fields)
}

def getSingData(id):
    data = Role.query.filter_by(id = id , is_del = '0').first()
    if not data :
        abort(RET.NotFound,msg='角色不存在')
    return data

class RoleAuthResource(Resource):
    @api.doc(api_doc=doc.auth)
    @login_required
    def post(self):
        '''
        角色授权
        '''
        args = parse_rules.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        sing_data = getSingData(id)
        rules = json.loads(args.get('rules'))
        # 清空原来的rules
        old_data = RoleRule.query.filter_by(role_id = id ).all()
        if old_data :
            Crud.clean_all(old_data)
        #没有设置任何权限点就清空后返回
        if not rules:
            return {
                    'status':RET.OK,
                    'msg':'权限设置成功'
                }   
        # 新增新的权限
        relation_data = [RoleRule(
            role_id = sing_data.id,
            rule_id =v
        ) for v in rules ]
        if Crud.add_all(relation_data):
            sing_data.last_editor = g.admin.username
            Role().updata()
            return {
                    'status':RET.OK,
                    'msg':'权限设置成功'
                }    
        abort(RET.BadRequest,msg='权限设置失败，请重试...') 

class RoleResource(Resource):
    @api.doc(api_doc=doc.add)
    @login_required
    def post(self):
        '''
        添加
        '''
        args = parse_base.parse_args()
        name = args.get('name')
        info = args.get('info')
        _data = Role.query.filter_by(name = name,is_del = '0').first()
        if _data:
            abort(RET.Forbidden,msg='当前角色已存在')
        model_data = Role()
        model_data.name = name
        model_data.info = info
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
        info = args.get('info')
        # 如果名称存在，并且ID不是当前ID
        _data = Role.query.filter(Role.id != id , Role.is_del == '0',Role.name == name).first()
        if _data:
            abort(RET.Forbidden,msg='角色已存在')
        sing_data.name = name
        sing_data.info = info
        sing_data.last_editor = g.admin.username
        result = Role().updata()
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
            sql = '''
            SELECT j.*,GROUP_CONCAT(r.rule_id SEPARATOR ',') as rules
            FROM role as j
            left join role_rule as r on j.id = r.role_id
            WHERE j.is_del = 0 AND j.id = %s
            '''%id
            sql_data = Crud.auto_select(sql)
            first_data = sql_data.first()
            if not first_data:
                abort(RET.NotFound,msg='角色不存在')
            return {
                        'status':RET.OK,
                        'data':mysql_to_json(dict(first_data))
                } 
        _list = Role.query.filter_by(is_del = '0').all()
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
        result = Role().updata()
        # 清空原来的授权
        _auth = RoleRule.query.filter_by(role_id = id ).all()
        if _auth :
            Crud.clean_all(_auth)
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        