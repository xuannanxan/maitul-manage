from flask_restful import Resource,reqparse,fields,marshal,abort,inputs
from app.apis.api_constant import *
from app.models.blog import BlogTag
from app.utils import object_to_json
from app.config import PAGINATE_NUM

parse_base = reqparse.RequestParser()
parse_base.add_argument('name',type=str,required=True,help='请输入标签名称')
parse_base.add_argument('sort',type=int,required=True,help='请输入排序号，数字越大越靠前')

parse_page = reqparse.RequestParser()
parse_page.add_argument('page',type=int,help='页码错误')

tag_fields = {
    'name':fields.String,
    'sort':fields.Integer,
    'id':fields.String
}
sing_tag_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(tag_fields)
}
def getTag(id):
    tag = BlogTag.query.filter(BlogTag.id == id , BlogTag.is_del == 0).first_or_404()
    return tag

class BlogTagsList(Resource):
    def get(self):
        args = parse_page.parse_args()
        page = 1
        if args.get('page'):
            page = int(args.get('page'))
        tag_list = BlogTag.query.filter(BlogTag.is_del == 0).order_by('sort').paginate(page, PAGINATE_NUM, False)
        if not tag_list:
            return {}
        data = {
                    'status':RET.OK,
                    'paginate':{
                        'page':tag_list.page,
                        'per_page':tag_list.per_page,
                        'total':tag_list.total
                    },
                    'data':[object_to_json(v) for v in tag_list.items]
            }
        return data 

    def post(self):
        '''
        新增
        '''
        args = parse_base.parse_args()
        name = args.get('name')
        sort = args.get('sort')
        tag = BlogTag.query.filter(BlogTag.name == name).first()
        if tag:
            abort(RET.BadRequest,msg='标签已存在')
        blog_tag = BlogTag()
        blog_tag.name = name
        blog_tag.sort = sort
        if blog_tag.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':blog_tag
            }
            return marshal(data,sing_tag_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

class BlogTags(Resource):
    def get(self,id):
        '''
        获取单个数据
        '''
       
        return object_to_json(getTag(id))
    
        
    def put(self,id):
        '''
        修改
        '''
        pass
    def delete(self,id):
        '''
        逻辑删除
        '''
        tag = getTag(id)
        tag.is_del = tag.id
        result = BlogTag().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        