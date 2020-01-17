#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-18 20:47:10
@LastEditTime : 2019-12-20 22:13:52
@LastEditors  : Xuannan
'''

from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled


space_id = StringQueryFiled(name='space_id',
						description="所属广告位",
						default='',
						required=True).data	
name = StringQueryFiled(name='name',
						description="广告名称",
						default='',
						required=True).data						
sort = IntegerQueryFiled(name='sort',
						description="排序号",
						default='',
						required=True).data	
url = IntegerPathFiled(name='url',
						description="链接地址",
						default='').data	
info = IntegerPathFiled(name='info',
						description="描述",
						default='').data	
img = IntegerPathFiled(name='img',
						description="图片",
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
						'name':{"type": "string",},
						'url':{"type": "string",},
						'info':{"type": "string",},
						'img':{"type": "string",},
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
		name,sort,info,img,url,space_id
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


