
from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models import Message
from app.utils import object_to_json,mysql_to_json
from app.utils.mail import SendMail
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.resource import message_doc as doc
from flask import g ,request
from app.config import PAGINATE_NUM

api = Apidoc('通用-留言')


# 单数据操作
parse_base = reqparse.RequestParser()
parse_base.add_argument('id',type=str)
parse_base.add_argument('site',type=str,required=True,help='请勿非法操作...')

parse_form = parse_base.copy()
parse_form.add_argument('name',type=str)
parse_form.add_argument('email',type=str)
parse_form.add_argument('contact',type=str)
parse_form.add_argument('info',type=str)

parse_reply = parse_base.copy()
parse_reply.add_argument('reply',type=str)
parse_reply.add_argument('show',type=int)
parse_reply.add_argument('sendmail',type=bool)


parse_page = parse_base.copy()
parse_page.add_argument('page',type=int,help='页码只能是数字')
parse_page.add_argument('paginate',type=int,help='每页数量只能是数字')

_fields = {
    'name':fields.String,
    'create_time':fields.String,
    'id':fields.String
}
sing_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(_fields)
}

def getSingData(id):
    data = Message.query.filter_by(id = id , is_del = '0').first()
    if not data :
        abort(RET.NotFound,msg='信息不存在')
    return data

class MessageResource(Resource):
    @api.doc(api_doc=doc.add)
    def post(self):
        '''
        添加
        '''
        args = parse_form.parse_args()
        name = args.get('name')
        email = args.get('email')
        contact = args.get('contact')
        info = args.get('info')
        site = args.get('site')
        ip =  request.remote_addr
        model_data = Message()
        model_data.name = name
        model_data.email = email
        model_data.contact = contact
        model_data.info = info
        model_data.ip = ip
        model_data.site = site
        if model_data.add():
            data = {
                    'status':RET.Created,
                    'msg':'Success',
                    'data':model_data
            }
            subject = '您有新的询盘，请注意查收！'
            html_body = '<p>姓名：%s</p>' \
                        '<p>邮箱：%s</p>' \
                        '<p>联系方式：%s</p>' \
                        '<p>留言内容：%s</p>' \
                        '<p>用户来源：%s</p>'% (name, email,contact,info,ip)
            _mail = SendMail(subject=subject,html_body=html_body)
            _mail.send_email()
            return marshal(data,sing_fields)
        abort(RET.BadRequest,msg='error')

    @api.doc(api_doc=doc.put)
    @login_required  
    @permission_required
    def put(self):
        '''
        回复
        '''
        args = parse_reply.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        sing_data = getSingData(id)
        reply = args.get('reply')
        show = args.get('show') 
        sendmail = args.get('sendmail')
        sing_data.reply = reply if reply else sing_data.reply
        sing_data.show = show if show else sing_data.show
        sing_data.last_editor = g.admin.username
        result = Message().updata()
        if result:
            if sing_data.email and sendmail:
                subject = 'RE:%s'%(sing_data.info[0:20])
                html_body = reply
                _mail = SendMail(subject=subject,html_body=html_body,recipients=[sing_data.email])
                _mail.send_email()
            data =  {
                'status':RET.OK,
                'msg':'回复成功',
                'data':sing_data
            }
            return marshal(data,sing_fields)
        abort(RET.BadRequest,msg='回复失败，请重试')

    @api.doc(api_doc=doc.lst)
    @login_required
    @permission_required
    def get(self):
        '''
        获取列表
        '''
        args = parse_page.parse_args()
        id = args.get('id')
        site = args.get('site')
        if id:
            return {
                    'status':RET.OK,
                    'data':object_to_json(getSingData(id))
            }
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        _list = Message.query.filter_by(is_del = '0',site=site).order_by(Message.create_time.desc()).paginate(page, paginate, False)
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
    @permission_required
    def delete(self):
        '''
        删除
        '''
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作')
        sing_data = getSingData(id)
        sing_data.is_del = sing_data.id
        sing_data.last_editor = g.admin.username
        result = Message().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        
class ShowMessageResource(Resource):
    @api.doc(api_doc=doc.get)
    def get(self):
        '''
        SHOW的留言和回复
        '''
        args = parse_page.parse_args()
        site = args.get('site')
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        _list = Message.query.with_entities(
            Message.name,
            Message.info,
            Message.create_time,
            Message.reply,
            Message.update_time,
            Message.last_editor
            ).filter_by(is_del = '0',site=site,show = '1').order_by(Message.create_time.desc()).paginate(page, paginate, False)
        if not _list:
            abort(RET.BadRequest,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'paginate':{
                        'page':_list.page,
                        'per_page':_list.per_page,
                        'total':_list.total
                    },
                    'data':[mysql_to_json(v) for v in _list.items]
            }
        return data  