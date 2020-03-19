#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-26 09:05:26
@LastEditTime: 2020-03-19 16:14:01
@LastEditors: Xuannan
'''
from flask_restful import Resource,abort
from app.apis.api_constant import *
from app.models import BlogContent,BlogContentTag, MaitulContent,MaitulContentTag,InfoContent,InfoContentTag,MetalpartsContent,MetalpartsContentTag
from app.models import WebConfig,BlogCategory,MaitulCategory,MetalpartsCategory,InfoCategory
from app.utils import object_to_json
from app.utils.tree import build_tree

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
        
class SiteDataResource(Resource):
    def get(self,site):
        """
        站点的全部数据资源
        """
        siteData,configData = {},{} 
        # 根据site初始化数据
        contentModel,tagModel,categoryModel,contentTable ,contentTagTable,tagTable,categoryTable= setModel(site)
        # 站点的配置信息
        webconfig = WebConfig.query.filter_by(is_del = '0',site=site).order_by(WebConfig.sort.desc()).all()
        for v in webconfig:
            configData[v.ename] = v.value
        #获取分类树
        cate_list = categoryModel.query.filter_by(is_del = '0').order_by(categoryModel.sort.desc()).all()
        #获取tag
        tag_list = tagModel.query.filter_by(is_del = '0').order_by(tagModel.sort.desc(),tagModel.create_time.desc()).all()
        siteData['webconfig']=configData
        siteData['category']=build_tree(cate_list,'0',0) 
        siteData['tags']=[object_to_json(v) for v in tag_list]
        data = {
            'status':RET.OK,
            'data':siteData
        }
        return data  
        
        