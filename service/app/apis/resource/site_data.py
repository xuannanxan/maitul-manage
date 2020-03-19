#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-26 09:05:26
@LastEditTime: 2020-03-19 22:01:42
@LastEditors: Xuannan
'''
from flask_restful import Resource,abort
from app.apis.api_constant import *
from app.models import Crud,BlogContent,BlogContentTag, MaitulContent,MaitulContentTag,InfoContent,InfoContentTag,MetalpartsContent,MetalpartsContentTag
from app.models import WebConfig,BlogCategory,MaitulCategory,MetalpartsCategory,InfoCategory,BlogTag,MaitulTag,InfoTag,MetalpartsTag
from app.utils import object_to_json,mysql_to_json
from app.utils.tree import build_tree

def setModel(site):
    # 动态设置表名和模型
    if site == 'blog':
        return BlogTag,BlogCategory
    elif site == 'maitul':
        return MaitulTag,MaitulCategory
    elif site == 'info':
        return InfoTag,InfoCategory
    elif site == 'metalparts':
        return MetalpartsTag,MetalpartsCategory
    else:
        abort(RET.NotFound,msg='请勿非法操作...')
        
class SiteDataResource(Resource):
    def get(self,site):
        """
        站点的全部数据资源
        """
        siteData,configData,adData = {}, {} ,{} 
        # 根据site初始化数据
        tagModel,categoryModel= setModel(site)
        # 站点的配置信息
        webconfig = WebConfig.query.filter_by(is_del = '0',site=site).order_by(WebConfig.sort.desc()).all()
        if webconfig:
            for v in webconfig:
                configData[v.ename] = v.value
        #获取分类树
        cate_list = categoryModel.query.filter_by(is_del = '0').order_by(categoryModel.sort.desc()).all()
        #获取tag
        tag_list = tagModel.query.filter_by(is_del = '0').order_by(tagModel.sort.desc(),tagModel.create_time.desc()).all()
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
                   adData[v.ename].append(mysql_to_json(dict(v)))
                else:
                    adData[v.ename] = [mysql_to_json(dict(v))]
        siteData['webconfig']=configData 
        siteData['category']=build_tree(cate_list,'0',0) if cate_list else []
        siteData['tags']=[object_to_json(v) for v in tag_list] if tag_list else []
        siteData['adspace']=adData 
        data = {
            'status':RET.OK,
            'data':siteData
        }
        return data  
        
        