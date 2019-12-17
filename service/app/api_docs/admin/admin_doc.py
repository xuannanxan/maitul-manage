#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:20:20
@LastEditTime: 2019-12-18 00:35:33
@LastEditors: Xuannan
'''
from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled


uid_in_path = StringPathFiled(name='uid',
							  description="用户ID",
							  enum=['0000aef0774f11e8ba9500163e0ce7e6',
									'00171b62791711e889ad00163e0ce7e6',
									'0017be56959511e8b34700163e0ce7e6',
									'001aa40c61c111e8a8a600163e0ce7e6',
									'001ea0984fa111e8a3d400163e0ce7e6'],
							  default='0000aef0774f11e8ba9500163e0ce7e6',
							  required=True).data

get_admin = {
	"parameters": [],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "用户获取自身信息",
			"examples": {
			},
			"properties":{
				'data':{
					'properties':{
						'name':'',
						'email':'',
						'phone':'',
						'createtime':'',
						'updatatime':'',
						'is_super':'',
						'id':'',
						}
					
				}
			}
		}
	}
}

change_pwd = {
	"parameters": [
		{
			"name": "password",
			"in": "path",
			"type": "string",
			"required": "true",
			"default": ""
		},
		{
			"name": "new_password",
			"in": "path",
			"type": "string",
			"required": "true",
			"default": ""
		},
	],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "密码修改成功，请重新登录",
			"examples": {
				'msg':'密码修改成功，请重新登录'
			}
		}
	}
}

delete_user = {
	"parameters": [],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "用户注销",
			"examples": {
			}
		}
	}
}
