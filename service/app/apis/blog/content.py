#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:28:32
@LastEditTime: 2019-12-13 16:34:31
@LastEditors: Xuannan
'''

from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.blog import BlogContent,BlogTagRelation
from app.models.base import Crud
from app.utils import object_to_json,mysql_to_json
from app.config import PAGINATE_NUM

parse_base = reqparse.RequestParser()
parse_base.add_argument('title',type=str,required=True,help='请输入标题')
parse_base.add_argument('sort',type=int,help='排序号只能是数字')
parse_base.add_argument('keywords')
parse_base.add_argument('description')
parse_base.add_argument('content')
parse_base.add_argument('cover')
parse_base.add_argument('tags')
parse_base.add_argument('category_id',type=str,required=True,help='请选择所属分类')   

parse_page = reqparse.RequestParser()
parse_page.add_argument('page',type=int,help='页码只能是数字')
parse_page.add_argument('paginate',type=int,help='每页数量只能是数字')
parse_page.add_argument('tag')
parse_page.add_argument('category')
parse_page.add_argument('search')

content_fields = {
    'id':fields.String,
    'title':fields.String,
    'keywords':fields.String,
    'description':fields.String,
    'content':fields.String,
    'cover':fields.String,
    'sort':fields.Integer,
}
sing_content_fields = {
    'status':fields.Integer,
    'msg':fields.String,
    'data':fields.Nested(content_fields)
}
def getContent(id):
    content = BlogContent.query.filter_by(id = id , is_del = '0').first()
    if not content :
        abort(RET.NotFound,msg='内容不存在')
    return content


class BlogContentAdd(Resource):
    def post(self):
        """
        添加内容
        """
        args = parse_base.parse_args()
        title = args.get('title')
        keywords = args.get('keywords')
        description = args.get('description')
        content = args.get('content')
        cover = args.get('cover')
        tags = args.get('tags')
        sort = args.get('sort')
        category_id = args.get('category_id')

        blog_content = BlogContent()
        blog_content.title = title
        blog_content.keywords = keywords
        blog_content.description = description
        blog_content.content = content
        blog_content.cover = cover
        blog_content.category_id = category_id
        blog_content.sort = sort
        if blog_content.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':blog_content
            }
            if tags:
                tag_data = [BlogTagRelation(
                    content_id = blog_content.id,
                    tag_id =v
                ) for v in tags.split(',') ]
                Crud.add_all(tag_data)
            return marshal(data,sing_content_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

        
class BlogContentList(Resource):
    def get(self):
        '''
        内容列表
        '''
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        tag = args.get('tag')
        category = args.get('category')
        search = args.get('search')
        # 开始拼接查询语句
        query = '{0}{1}{2}'.format(
            't.name = "%s" and '%tag if tag else '',
            'c.category_id = %s and '%category if category else '',
            '(c.title like "%{0}%" or c.content like "%{0}%") and '.format(search) if search else ''
        )
        sql = '''
            SELECT 
            SQL_CALC_FOUND_ROWS c.*,
            GROUP_CONCAT(t.name SEPARATOR ',') as tags
            FROM blog_content as c
            left join blog_tag_relation as r on c.id = r.content_id
            left join blog_tag as t on t.id = r.tag_id
            WHERE {0} c.is_del = 0
            GROUP BY c.id
            ORDER BY c.sort DESC
            LIMIT {1},{2};
        '''.format(query,(page-1)*paginate,paginate)
        sql_data = Crud.auto_select(sql)
        # 查询总数
        count_num = Crud.auto_select("SELECT FOUND_ROWS() as countnum")
        count = int((count_num.first()).countnum)
        fetchall_data = sql_data.fetchall()
        if not fetchall_data:
            abort(RET.NotFound,msg='暂无数据')
        data = {
                    'status':RET.OK,
                    'paginate':{
                        'page':page,
                        'per_page':paginate,
                        'total':count
                    },
                    'data':([mysql_to_json(dict(v))  for v in fetchall_data])
            }
        return data 

    

class BlogContentResource(Resource):
    def get(self,id):
        '''
        单个内容
        '''
        sql='''
        SELECT c.*,GROUP_CONCAT(t.name SEPARATOR ',') as tags
        FROM blog_content as c
            left join blog_tag_relation as r on c.id = r.content_id
            left join blog_tag as t on t.id = r.tag_id
        WHERE c.id = %s and c.is_del = 0;
        '''%(id)
        sql_data = Crud.auto_select(sql)
        data = sql_data.first()
        if not data.id:
            abort(RET.NotFound,msg='内容不存在')
        return {
                    'status':RET.OK,
                    'data':mysql_to_json(dict(data))
            } 
    
        
    def put(self,id):
        '''
        修改内容
        '''
        blog_content = getContent(id)
        args = parse_base.parse_args()
        title = args.get('title')
        keywords = args.get('keywords')
        description = args.get('description')
        content = args.get('content')
        cover = args.get('cover')
        tags = args.get('tags')
        category_id = args.get('category_id')
        blog_content.title = title if title else blog_content.title
        blog_content.keywords = keywords if keywords else blog_content.keywords
        blog_content.description = description if description else blog_content.description
        blog_content.content = content if content else blog_content.content
        blog_content.cover = cover if cover else blog_content.cover
        blog_content.category_id = category_id if category_id else blog_content.category_id
        result = BlogContent().updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':blog_content
            }
            # 清空原来的tags
            old_tag_data = BlogTagRelation.query.filter_by(content_id = id ).all()
            if old_tag_data :
                Crud.clean_all(old_tag_data)
            # 重新添加tags
            if tags:
                new_tag_data = [BlogTagRelation(
                        content_id = blog_content.id,
                        tag_id =v
                    ) for v in tags.split(',') ]
                Crud.add_all(new_tag_data)
            return marshal(data,sing_content_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')

    def delete(self,id):
        '''
        删除内容
        '''
        blog_content = getContent(id)
        blog_content.is_del = blog_content.id
        result = BlogContent().updata()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        
