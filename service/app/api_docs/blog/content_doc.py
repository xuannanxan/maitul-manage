#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:20:20
@LastEditTime: 2019-12-18 15:10:23
@LastEditors: Xuannan
'''
from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled


category_id = StringQueryFiled(name='category_id',
						description="所属分类",
						default='',
						required=True).data	
tags = StringQueryFiled(name='tags',
						description="标签",
						default='').data
keywords = StringQueryFiled(name='keywords',
						description="关键词",
						default='').data	
description = StringQueryFiled(name='description',
						description="描述",
						default='').data	
content = StringQueryFiled(name='content',
						description="内容",
						default='').data	
cover = StringQueryFiled(name='cover',
						description="封面图",
						default='').data	
title = StringQueryFiled(name='title',
						description="标题",
						default='',
						required=True).data						
sort = IntegerQueryFiled(name='sort',
						description="排序号",
						default='').data	
page = IntegerPathFiled(name='page',
						description="页码",
						default=1).data	
paginate = IntegerPathFiled(name='paginate',
							description="每页数量",
							default=10).data
tag = StringQueryFiled(name='tag',
						description="根据标签名称搜索",
						default='').data
search = StringQueryFiled(name='search',
						description="根据关键词搜索",
						default='').data
category = StringQueryFiled(name='category',
						description="根据分类ID搜索",
						default='').data
id = StringPathFiled(	name='id',
						description="id",
						default='',
						required=True).data		
data_fields = {
						'category_id':{"type": "string",},
						'name':{"type": "string",},
						'keywords':{"type": "string",},
						'description':{"type": "string",},
						'content':{"type": "string",},
						'cover':{"type": "string",},
						'sort':{"type": "integer",},
						'id':{"type": "string",},
						'tags':{"type": "string",},
						}

lst = {
	"description": "列表",
	"parameters": [
		page,paginate,tag,category_id,search
	],
	"responses": {
		"200": {
			"description": "获取成功",
			"properties":{
				'data':{
					'properties':data_fields
				},
				'paginate':{
					'properties':{
						'page':{"type": "integer"	},
						'per_page':{"type": "integer"	},
						'total':{"type": "integer"	}
					}
				}
			}
		}
	}
}



get = {
	"description": "根据id获取信息",
	"parameters": [ id],
	"responses": {
		"200": {
			"description": "获取成功",
			"examples": {
			},
			"properties":{
				'data':{
					'properties':data_fields
				}
			}
		}
	}
}


delete = {
	"description": "删除",
	"parameters": [ id],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "删除成功",
			"properties":{
				'msg':{
					'type':'string'
				}
			}
		}
	}
}


put = {
	"description": "修改",
	"parameters": [ id],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "修改成功",
			"examples": {
				'msg':'修改成功'
			},
			"properties":{
				'msg':{
					"type": "string"	
				}
			}
		}
	}
}

add = {
	"description": "添加",
	"parameters": [
		category_id,title,keywords,description,content,sort,tags
	],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"201": {
			"description": "添加成功",
			"properties":{
				'data':{
					'properties':data_fields
				},
				'msg':{"type": "string"
					}
			}
		}
	}
}


