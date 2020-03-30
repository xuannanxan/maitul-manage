#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-26 09:05:26
@LastEditTime: 2020-03-30 22:29:36
@LastEditors: Xuannan
'''
from flask_restful import Resource,abort,reqparse
from app.apis.api_constant import *
from app.models import Crud,Lang,BlogContent,BlogContentTag, MaitulContent,MaitulContentTag,InfoContent,InfoContentTag,MetalpartsContent,MetalpartsContentTag
from app.models import WebConfig,BlogCategory,MaitulCategory,MetalpartsCategory,InfoCategory,BlogTag,MaitulTag,InfoTag,MetalpartsTag
from app.utils import result_to_dict
from app.utils.tree import build_tree
from app.config import PAGINATE_NUM
from flask import current_app,request
parse_page = reqparse.RequestParser()
parse_page.add_argument('page',type=int,help='页码只能是数字')
parse_page.add_argument('paginate',type=int,help='每页数量只能是数字')
parse_page.add_argument('tag')
parse_page.add_argument('category_id')
parse_page.add_argument('id')
parse_page.add_argument('search')


def setModel(site):
    # 动态设置表名和模型
    if site == 'blog':
        return BlogContent, BlogContentTag,BlogTag,BlogCategory,'blog_content','blog_content_tag','blog_tag','blog_category'
    elif site == 'maitul':
        return MaitulContent,MaitulContentTag,MaitulTag,MaitulCategory,'maitul_content', 'maitul_content_tag','maitul_tag','maitul_category'
    elif site == 'info':
        return InfoContent,InfoContentTag,InfoTag,InfoCategory,'info_content','info_content_tag','info_tag','info_category'
    elif site == 'metalparts':
        return MetalpartsContent,MetalpartsContentTag,MetalpartsTag,MetalpartsCategory, 'metalparts_content','metalparts_content_tag','metalparts_tag','metalparts_category'
    else:
        abort(RET.NotFound,msg='Not Found...')
        
class SiteDataResource(Resource):
    def get(self,site):
        """
        站点的全部数据资源
        """
        siteData,adData,contentData,commonData = {},{},{},{}
        # 语言类别 
        langList = Lang.query.with_entities(Lang.name,Lang.ename).filter_by(is_del = '0').order_by(Lang.sort.desc()).all()
        langData = [result_to_dict(v) for v in langList]
        # 根据site初始化数据
        contentModel,contentTagModel,tagModel,categoryModel,contentTable ,contentTagTable,tagTable,categoryTable= setModel(site)
        # 站点的配置信息
        webconfig = WebConfig.query.with_entities(WebConfig.ename,WebConfig.value,WebConfig.lang).filter_by(is_del = '0',site=site).order_by(WebConfig.sort.desc()).all()
        #获取分类列表
        cate_list = categoryModel.query.filter_by(is_del = '0').order_by(categoryModel.sort.desc()).all()
        #获取tag列表
        tag_list = tagModel.query.filter_by(is_del = '0').order_by(tagModel.sort.desc(),tagModel.create_time.desc()).all()
        if langList:
            for v in langList:
                tempConf,commonData[v.ename] = {},{}
                # 开始处理配置信息
                for conf in webconfig:
                    if conf.lang in (v.ename,'common',None):
                        # 转键值对
                        tempConf[conf.ename]=conf.value
                commonData[v.ename]['webconfig']=tempConf
                # 开始处理分类信息
                commonData[v.ename]['category'] = build_tree([cate for cate in cate_list if cate.lang in (v.ename,'common',None)],'0',0) if cate_list else []
                # 开始处理tag信息
                commonData[v.ename]['tags'] = [tag.name for tag in tag_list if tag.lang in (v.ename,'common',None)]
        else:
            # 如果是单语言
            tempConf = {}
            # 开始处理配置信息
            for conf in webconfig:
                tempConf[conf.ename]=conf.value
            commonData['webconfig']=tempConf
            # 开始处理分类信息
            commonData['category'] = build_tree(cate_list,'0',0) if cate_list else []
            # 开始处理tag信息
            commonData['tags'] = [tag.name for tag in tag_list ]

        #获取ad
        ad_sql = '''
                SELECT 
                a.name,a.info,a.url,a.img,s.ename
                FROM ad as a
                left join ad_space as s on s.id = a.space_id
                WHERE a.is_del = 0
                ORDER BY a.sort DESC;
            '''
        ad_data = Crud.auto_select(ad_sql)
        if  ad_data:
            fetchall_data = ad_data.fetchall()
            for v in fetchall_data:
                if adData.get(v.ename):
                   adData[v.ename].append(result_to_dict(v))
                else:
                    adData[v.ename] = [result_to_dict(v)]
        # 获取初始内容
        content_sql = '''
            SELECT c.* 
            FROM (
            SELECT id FROM {3} WHERE is_del = 0 and pid=0
            ) as a
            RIGHT JOIN 
            (
            select a.* ,c.pid,
            GROUP_CONCAT(t.id SEPARATOR ',') as tags,
            GROUP_CONCAT(t.name SEPARATOR ',') as tags_name,
            c.name as category_name,
            c.module as module,
            c.icon as category_icon
            from {0} a 
            left join {1} as r on a.id = r.content_id
            left join {2} as t on t.id = r.tag_id
            left join {3}  as c on c.id = a.category_id
            where (select count(*) from  {0}  
            where category_id = a.category_id  and( sort > a.sort or id < a.id) and is_del=0  ) <12  and a.is_del=0 
            GROUP BY a.id
            ) as c
            on   a.id in ( c.pid,c.category_id)
            ORDER BY c.sort DESC,c.create_time DESC;
        '''.format(contentTable,contentTagTable,tagTable,categoryTable)
        content_data = Crud.auto_select(content_sql)
        if  content_data:
            content_fetchall_data = content_data.fetchall()
            for v in content_fetchall_data:
                if contentData.get(v.pid if v.pid!='0' else v.category_id):
                    if len(contentData[v.pid if v.pid!='0' else v.category_id]) <12:
                        contentData[v.pid if v.pid!='0' else v.category_id].append(result_to_dict(v))
                else:
                    contentData[v.pid if v.pid!='0' else v.category_id] = [result_to_dict(v)]
        siteData['adspace']=adData 
        siteData['lang']= langData
        siteData['content']= contentData
        siteData['common']= commonData
        data = {
            'status':RET.OK,
            'data':siteData
        }
        return data  
        
class ContentsResource(Resource):
    def get(self,site):
        '''
        内容列表1
        '''
        # 根据site初始化数据
        contentModel,contentTagModel,tagModel,categoryModel,contentTable ,contentTagTable,tagTable,categoryTable= setModel(site)
        args = parse_page.parse_args()
        id = args.get('id')
        # 如果有id,进行计数
        if id:
            sql = '''
            SELECT 
            SQL_CALC_FOUND_ROWS c.*,
            GROUP_CONCAT(t.id SEPARATOR ',') as tags,
            GROUP_CONCAT(t.name SEPARATOR ',') as tags_name,
            a.name as category_name,
            a.module as module,
            a.pid as pid,
            a.icon as category_icon
            FROM {0} as c
            left join {1} as r on c.id = r.content_id
            left join {2} as t on t.id = r.tag_id
            left join {3} as a on a.id = c.category_id or a.pid = c.category_id
            WHERE c.is_del = 0
            AND c.id = {4};
            '''.format(contentTable,contentTagTable,tagTable,categoryTable,id)
            sql_data = Crud.auto_select(sql)
            if  sql_data:
                fetchall_data = sql_data.fetchone()
            if not fetchall_data:
                abort(RET.NotFound,msg='No Data...')
            _content = contentModel.query.filter_by(id = id , is_del = '0').first()
            _content.click = _content.click+1
            _content.updata()
            data = {
                        'status':RET.OK,
                        'data':(result_to_dict(fetchall_data))
                }
            return data 
        page = 1
        paginate = PAGINATE_NUM
        if args.get('page'):
            page = int(args.get('page'))
        if args.get('paginate'):
            paginate = int(args.get('paginate'))
        tag = args.get('tag')
        search = args.get('search')
        category_id = args.get('category_id')
        if search:
            current_app.logger.info(request.remote_addr+':'+search)
        # 开始拼接查询语句
        query = '{0}{1}{2}'.format(
            ('t.name = "%s" and '%tag) if tag else '',
            ('(a.id = "{0}" OR a.pid = "{0}") and '.format(category_id)) if category_id else '',
            ('(c.title like "%{0}%" or c.content like "%{0}%") and '.format(search)) if search else ''
        )
        # 分页大于=1000时，返回全部数据
        limit = 'LIMIT {0},{1}'.format((page-1)*paginate,paginate)
        sql = '''
            SELECT 
            SQL_CALC_FOUND_ROWS c.*,
            GROUP_CONCAT(t.id SEPARATOR ',') as tags,
            GROUP_CONCAT(t.name SEPARATOR ',') as tags_name,
            a.name as category_name,
            a.module as module,
            a.icon as category_icon
            FROM {0} as c
            left join {1} as r on c.id = r.content_id
            left join {2} as t on t.id = r.tag_id
            left join {3} as a on a.id = c.category_id or a.pid = c.category_id
            WHERE {4} c.is_del = 0
            GROUP BY c.id
            ORDER BY c.sort DESC,c.create_time DESC
            {5};
        '''.format(contentTable,contentTagTable,tagTable,categoryTable,query,limit)
        sql_data,count = Crud.auto_select(sql,count=True)
        if  sql_data:
            fetchall_data = sql_data.fetchall()
            if not fetchall_data:
                abort(RET.NotFound,msg='No Data...')
            data = {
                        'status':RET.OK,
                        'paginate':{
                            'page':page,
                            'per_page':paginate,
                            'total':count
                        },
                        'data':([result_to_dict(v)  for v in fetchall_data])
                }
            return data 
        abort(RET.NotFound,msg='None data')