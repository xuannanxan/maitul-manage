#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-11 17:28:51
@LastEditTime: 2020-02-29 22:10:02
@LastEditors: Xuannan
'''


from flask_restful import Resource,reqparse,fields,marshal,abort
from app.apis.api_constant import *
from app.models.base import Crud
from app.utils import object_to_json,mysql_to_json
from app.config import PAGINATE_NUM
from app.apis.admin.common import login_required,permission_required
from app.utils.api_doc import Apidoc
from app.api_docs.cms import content_doc
from flask import g,current_app,request

from app.models import BlogContent,BlogContentTag, MaitulContent,MaitulContentTag,InfoContent,InfoContentTag,MetalpartsContent,MetalpartsContentTag
from app.models import BlogCategory,MaitulCategory,MetalpartsCategory,InfoCategory
api = Apidoc('内容管理-内容')

parse_id = reqparse.RequestParser()
parse_id.add_argument('id')

parse_base = parse_id.copy()
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
parse_page.add_argument('category_id')
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



def getContent(id,contentModel):
    content = contentModel.query.filter_by(id = id , is_del = '0').first()
    if not content :
        abort(RET.NotFound,msg='内容不存在')
    return content

def setModel(site):
    # 动态设置表名和模型
    if site == 'blog':
        return BlogContent, BlogContentTag,BlogCategory,'blog_content','blog_content_tag','blog_tag','blog_category'
    elif site == 'maitul':
        return MaitulContent,MaitulContentTag,MaitulCategory,'maitul_content', 'maitul_content_tag','maitul_tag','maitul_category'
    elif site == 'info':
        return InfoContent,InfoContentTag,InfoCategory,'info_content','info_content_tag','info_tag','info_category'
    elif site == 'metalparts':
        return MetalpartsContent,MetalpartsContentTag,MetalpartsCategory, 'metalparts_content','metalparts_content_tag','metalparts_tag','metalparts_category'
    else:
        abort(RET.NotFound,msg='请勿非法操作...')

class ContentResource(Resource):
    @api.doc(api_doc=content_doc.add)
    @login_required
    @permission_required
    def post(self,site):
        """
        添加内容
        """
        contentModel,contentTagModel,categoryModel,contentTable ,contentTagTable,TagTable,categoryTable= setModel(site)
        args = parse_base.parse_args()
        title = args.get('title')
        keywords = args.get('keywords')
        description = args.get('description')
        content = args.get('content')
        cover = args.get('cover')
        tags = args.get('tags')
        sort = args.get('sort')
        category_id = args.get('category_id')
        _content = contentModel()
        _content.title = title
        _content.keywords = keywords
        _content.description = description
        _content.content = content
        _content.cover = cover
        _content.category_id = category_id
        _content.sort = sort
        _content.author = g.admin.username
        _content.last_editor = g.admin.username
        if _content.add():
            data = {
                    'status':RET.Created,
                    'msg':'添加成功',
                    'data':_content
            }
            if tags:
                tag_data = [contentTagModel(
                    content_id = _content.id,
                    tag_id =v
                ) for v in tags.split(',') ]
                Crud.add_all(tag_data)
            return marshal(data,sing_content_fields)
        abort(RET.BadRequest,msg='添加失败，请重试')

        
    @api.doc(api_doc=content_doc.lst)
    def get(self,site):
        '''
        内容列表1
        '''
        contentModel,contentTagModel,categoryModel,contentTable ,contentTagTable,TagTable,categoryTable = setModel(site)
        argsById = parse_id.parse_args()
        id = argsById.get('id')
        # 如果有id,就返回单个内容
        if id:
            sql='''
                SELECT c.*,GROUP_CONCAT(t.id SEPARATOR ',') as tags,
                GROUP_CONCAT(t.name SEPARATOR ',') as tags_name,
                a.name as category_name,
                a.url as category_url,
                a.icon as category_icon
                FROM %s as c
                    left join %s as r on c.id = r.content_id
                    left join %s as t on t.id = r.tag_id
                    left join %s as a on a.id = c.category_id
                WHERE c.id = '%s' and c.is_del = 0;
                '''%(contentTable,contentTagTable,TagTable,categoryTable,id)
            sql_data = Crud.auto_select(sql)
            if not sql_data:
                abort(RET.NotFound,msg='内容不存在')
            data = sql_data.first()
            _content = getContent(id,contentModel)
            _content.click = _content.click+1
            _content.updata()
            return {
                        'status':RET.OK,
                        'data':mysql_to_json(dict(data))
                } 
        args = parse_page.parse_args()
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        tag = args.get('tag')
        category_id = args.get('category_id')
        category = args.get('category')
        if category:
            cateData = categoryModel.query.filter_by(ename = category , is_del = '0').first()
            category_id = cateData.id if cateData else ''
        search = args.get('search')
        if search:
            current_app.logger.info(request.remote_addr+':'+search)
        # 开始拼接查询语句
        query = '{0}{1}{2}'.format(
            ('t.name = "%s" and '%tag) if tag else '',
            ('(a.id = "{0}" OR a.pid = "{0}") and '.format(category_id)) if category_id else '',
            ('(c.title like "%{0}%" or c.content like "%{0}%") and '.format(search)) if search else ''
        )
        sql = '''
            SELECT 
            SQL_CALC_FOUND_ROWS c.*,
            GROUP_CONCAT(t.id SEPARATOR ',') as tags,
            GROUP_CONCAT(t.name SEPARATOR ',') as tags_name,
            a.name as category_name,
            a.url as category_url,
            a.icon as category_icon
            FROM {0} as c
            left join {1} as r on c.id = r.content_id
            left join {2} as t on t.id = r.tag_id
            left join {3} as a on a.id = c.category_id
            WHERE {4} c.is_del = 0
            GROUP BY c.id
            ORDER BY c.sort DESC,c.create_time DESC
            LIMIT {5},{6};
        '''.format(contentTable,contentTagTable,TagTable,categoryTable,query,(page-1)*paginate,paginate)
        sql_data,count = Crud.auto_select(sql,count=True)
        if  sql_data:
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
        abort(RET.NotFound,msg='None data')

        
    
    @api.doc(api_doc=content_doc.put)
    @login_required   
    @permission_required 
    def put(self,site):
        '''
        修改内容
        '''
        contentModel,contentTagModel,categoryModel,contentTable ,contentTagTable,TagTable,categoryTable = setModel(site)
        args = parse_base.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        _content = getContent(id,contentModel)
        title = args.get('title')
        keywords = args.get('keywords')
        description = args.get('description')
        content = args.get('content')
        cover = args.get('cover')
        tags = args.get('tags')
        sort = args.get('sort')
        category_id = args.get('category_id')
        _content.title = title if title else _content.title
        _content.keywords = keywords if keywords else _content.keywords
        _content.description = description if description else _content.description
        _content.content = content if content else _content.content
        _content.cover = cover if cover else _content.cover
        _content.category_id = category_id if category_id else _content.category_id
        _content.last_editor = g.admin.username
        _content.sort = sort
        result = _content.updata()
        if result:
            data =  {
                'status':RET.OK,
                'msg':'修改成功',
                'data':_content
            }
            # 清空原来的tags
            old_data = contentTagModel.query.filter_by(content_id = id ).all()
            if old_data :
                Crud.clean_all(old_data)
            # 重新添加tags
            if tags:
                new_tag_data = [contentTagModel(
                        content_id = _content.id,
                        tag_id =v
                    ) for v in tags.split(',') ]
                Crud.add_all(new_tag_data)
            return marshal(data,sing_content_fields)
        abort(RET.BadRequest,msg='修改失败，请重试')
        
    @api.doc(api_doc=content_doc.put)
    @login_required
    @permission_required
    def delete(self,site):
        '''
        删除内容
        '''
        contentModel,contentTagModel,categoryModel,contentTable ,contentTagTable,TagTable,categoryTable = setModel(site)
        args = parse_id.parse_args()
        id = args.get('id')
        if not id:
            abort(RET.BadRequest,msg='请勿非法操作！！！')
        _content = getContent(id,contentModel)
        _content.last_editor = g.admin.username
        result = _content.delete()
        if result:
            return {
                'status':RET.OK,
                'msg':'删除成功'
            }
        abort(RET.BadRequest,msg='删除失败，请重试')
        
