#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:20:20
@LastEditTime : 2020-01-05 20:04:06
@LastEditors  : Xuannan
'''
from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled


username = StringQueryFiled(	name='username',
								description="用户名",
								default='',
								required=True).data
password = StringQueryFiled(	name='password',
								description="密码",
								default='',
								required=True).data		
new_password = StringQueryFiled(	name='new_password',
									description="新密码",
									default='',
									required=True).data		
captcha = StringQueryFiled(name='captcha',
						description="验证码",
						default='').data		
image_code = StringQueryFiled(name='image_code',
						description="验证码的图片编号",
						default='').data	
name = StringQueryFiled(name='name',
						description="姓名",
						default='',
						required=True).data						
email = StringQueryFiled(name='email',
						description="邮箱地址",
						default='',
						required=True).data	
phone = StringQueryFiled(name='phone',
						description="手机号码",
						default='',
						required=True).data	
roles = StringQueryFiled(name='roles',
						description="角色",
						default='',
						required=True).data	
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
user_fields = {
						'name':{"type": "string",},
						'email':{"type": "string",},
						'phone':{"type": "string",},
						'createtime':{"type": "string",},
						'updatatime':{"type": "string",},
						'is_super':{"type": "integer",},
						'id':{"type": "string",},
						}
get_admin = {
	"description": "用户获取自身信息",
	"parameters": [ ],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "获取成功",
			"examples": {
			},
			"properties":{
				'data':{
					'properties':user_fields
				}
			}
		}
	}
}



get_admin_by_id = {
	"description": "根据id获取用户信息",
	"parameters": [ id],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "获取成功",
			"examples": {
			},
			"properties":{
				'data':{
					'properties':user_fields
				}
			}
		}
	}
}

reset_pwd = {
	"description": "重置用户密码为123456a",
	"parameters": [ id],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "重置密码成功",
			"properties":{
				'msg':{
					'type':'string'
				}
			}
		}
	}
}

roles = {
	"description": "设置角色",
	"parameters": [ id,roles],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "设置角色成功",
			"properties":{
				'msg':{
					'type':'string'
				}
			}
		}
	}
}

del_admin = {
	"description": "删除指定用户",
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

change_pwd = {
	"description": "用户自行修改密码",
	"parameters": [
		password,new_password
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
			},
			"properties":{
				'msg':{
					"type": "string"	
				}
			}
		}
	}
}
change_info = {
	"description": "用户自行修改个人资料",
	"parameters": [
		name,email,phone
	],
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
admin_list = {
	"description": "用户列表",
	"parameters": [
		page,paginate
	],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "获取成功",
			"properties":{
				'data':{
					'properties':user_fields
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

admin_add = {
	"description": "添加用户",
	"parameters": [
		username,password,name,email,phone
	],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"201": {
			"description": "新增管理员成功",
			"properties":{
				'data':{
					'properties':user_fields
				},
				'msg':{"type": "string"
					}
			}
		}
	}
}


login = {
	"description": "登陆",
	"parameters": [
		username,password
	],
	"responses": {
		"200": {
			"description": "登陆成功",
			"examples": {
				'msg':'登陆成功'
			},
			"properties":{
				'msg':{
					"type": "string"	
				}
			}
		}
	}
}

logout = {
	"description": "登出",
	"parameters": [ ],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"200": {
			"description": "已退出",
			"examples": {
			},
			"properties":{
				'msg':{
					'type':'string'
				}
			}
		}
	}
}