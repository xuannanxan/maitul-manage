#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:20:20
@LastEditTime: 2019-12-18 14:53:04
@LastEditors: Xuannan
'''
from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled


pid = StringQueryFiled(name='pid',
						description="上级分类",
						default='',
						required=True).data	
keywords = StringQueryFiled(name='keywords',
						description="关键词",
						default='').data	
description = StringQueryFiled(name='description',
						description="描述",
						default='').data	
icon = StringQueryFiled(name='icon',
						description="图标",
						default='').data	
cover = StringQueryFiled(name='cover',
						description="封面图",
						default='').data	
name = StringQueryFiled(name='name',
						description="姓名",
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
id = StringPathFiled(	name='id',
						description="id",
						default='',
						required=True).data		
data_fields = {
						'pid':{"type": "string",},
						'name':{"type": "string",},
						'keywords':{"type": "string",},
						'description':{"type": "string",},
						'icon':{"type": "string",},
						'cover':{"type": "string",},
						'sort':{"type": "integer",},
						'id':{"type": "string",},
						}

lst = {
	"description": "列表",
	"parameters": [
		page,paginate
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
		pid,name,keywords,description,icon,sort
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


