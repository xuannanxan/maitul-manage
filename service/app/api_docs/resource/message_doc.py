#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-18 20:47:10
@LastEditTime : 2020-02-01 17:29:13
@LastEditors  : Xuannan
'''

from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled



name = StringQueryFiled(name='name',
						description="姓名",
						default='').data	
contact = StringQueryFiled(name='contact',
						description="联系方式",
						default='').data	
email = StringQueryFiled(name='email',
						description="邮箱",
						default='',
						required=True).data	
info = StringQueryFiled(name='info',
						description="留言内容",
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
						'email':{"type": "string",},
						'contact':{"type": "string",},
						'info':{"type": "string",},
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
		name,email,contact,info
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


