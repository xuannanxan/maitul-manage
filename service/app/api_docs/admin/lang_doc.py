#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-18 20:47:10
@LastEditTime: 2020-03-23 10:21:43
@LastEditors: Xuannan
'''

from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled



name = StringQueryFiled(name='name',
						description="名称",
						default='',
						required=True).data						
ename = StringQueryFiled(name='ename',
						description="调用名称",
						default='',
						required=True).data	
sort = IntegerQueryFiled(name='sort',
						description="排序",
						default='',
						required=True).data	
id = StringPathFiled(	name='id',
						description="id",
						default='',
						required=True).data		
data_fields = {
						'name':{"type": "string",},
						'ename':{"type": "string",},
						'sort':{"type": "integer",},
						'id':{"type": "string",},
						}

get = {
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
	"parameters": [ id,name,ename,sort],
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
		name,ename,sort
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


