#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:20:20
@LastEditTime : 2020-01-20 10:35:55
@LastEditors  : Xuannan
'''
from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled


moduleID = StringQueryFiled(name='moduleID',
						description="所属模块",
						default='',
						required=True).data	
name = StringQueryFiled(name='name',
						description="名称",
						default='',
						required=True).data	
ename = StringQueryFiled(name='ename',
						description="调用名称",
						default='',
						required=True).data		
fieldType = StringQueryFiled(name='fieldType',
						description="字段类型",
						default='',
						required=True).data	
placeholder = StringQueryFiled(name='placeholder',
						description="字段描述",
						default='',
						required=False).data	
values = StringQueryFiled(name='values',
						description="可选值",
						default='',
						required=False).data	
value = StringQueryFiled(name='value',
						description="默认值",
						default='',
						required=False).data				
sort = IntegerQueryFiled(name='sort',
						description="排序号",
						default='').data	
id = StringPathFiled(	name='id',
						description="id",
						default='',
						required=True).data		
data_fields = {
						'moduleID':{"type": "string",},
						'name':{"type": "string",},
						'ename':{"type": "string",},
						'fieldType':{"type": "string",},
						'placeholder':{"type": "string",},
						'values':{"type": "string",},
						'value':{"type": "string",},
						'sort':{"type": "integer",},
						'id':{"type": "string",},
						}

lst = {
	"description": "配置列表",
	"parameters": [
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
		moduleID,name,ename,placeholder,values,value,sort
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

save = {
	"description": "保存配置",
	"parameters": [
		moduleID,name,ename,placeholder,values,value,sort
	],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"201": {
			"description": "保存成功",
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
