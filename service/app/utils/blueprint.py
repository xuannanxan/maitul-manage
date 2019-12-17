#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:34:38
@LastEditTime: 2019-12-17 22:41:35
@LastEditors: Xuannan
'''

from flask import Blueprint as _Blueprint



class Blueprint(_Blueprint):
	'''新增rp_list属性'''
	def __init__(self, name, import_name, rp_list=[], static_folder=None,
				 static_url_path=None, template_folder=None,
				 url_prefix=None, subdomain=None, url_defaults=None,
				 root_path=None):
		self.rp_list = rp_list
		super(Blueprint, self).__init__(name, import_name, static_folder,
										static_url_path, template_folder,
										url_prefix, subdomain, url_defaults,
										root_path)

	@property
	def tags(self):
		'''
		Swagger API 文档分类
		数组中的顺序代表 Swagger 中的顺序
		'''
		return [rp.api.tag for rp in self.rp_list]

	def register_redprint(self):
		for rp in self.rp_list:
			rp.api.register(self)
		return self
