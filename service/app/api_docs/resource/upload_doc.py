#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:20:20
@LastEditTime : 2019-12-28 22:13:17
@LastEditors  : Xuannan
'''
from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled


file = StringQueryFiled(name='file',
						description="上传文件",
						default='',
						required=True).data	
	
data_fields = {
						'name':{"type": "string",},
						'path':{"type": "string",},
						'size':{"type": "string",},
						}


upload = {
	"description": "上传",
	"parameters": [
		file
	],
	"security": [
		{
			"Authorization": ''
		}
	],
	"responses": {
		"201": {
			"description": "上传成功",
			"properties":{
				'data':{
					'properties':data_fields
				},
			}
		}
	}
}


