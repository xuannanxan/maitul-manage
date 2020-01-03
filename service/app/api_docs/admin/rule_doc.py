#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-18 20:47:10
@LastEditTime : 2020-01-04 00:00:01
@LastEditors  : Xuannan
'''

from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled



name = StringQueryFiled(name='name',
						description="名称",
						default='',
						required=True).data						
url = StringQueryFiled(name='url',
						description="URL",
						default='',
						required=True).data	
method = StringQueryFiled(name='method',
						description="请求方法",
						default='',
						required=True).data	
menu_id = StringPathFiled(	name='menu_id',
						description="所属菜单",
						default='',
						required=True).data	
id = StringPathFiled(	name='id',
						description="id",
						default='',
						required=True).data		
data_fields = {
						'name':{"type": "string",},
						'url':{"type": "string",},
						'menu_id':{"type": "string",},
						'id':{"type": "string",},
						'method':{"type": "string",},
						}

lst = {
	"description": "列表",
	"parameters": [
	],
	"responses": {
		"200": {
			"description": "获取成功",
			"properties":{
				'data':{
					'properties':data_fields
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
	"parameters": [ id,name,url,menu_id,method],
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
		name,url,menu_id,method
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


