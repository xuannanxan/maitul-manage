#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:24:30
@LastEditTime: 2019-12-18 00:16:17
@LastEditors: Xuannan
'''

from functools import wraps
from flasgger import swag_from


# api = RedPrint(name='banner', description='首页轮播图', api_doc=api_doc)

class Apidoc:
	def __init__(self, tag):
		self.tag = tag
		

	def doc(self, *_args, **_kwargs):
		def decorator(f):
			specs = _kwargs.get('api_doc')
			if specs:
				specs['tags'] = [self.tag]
				# 对f.__doc__处理
				if f.__doc__ and '\n\t' in f.__doc__:
					f.__doc__ = f.__doc__.split('\n\t')[0]

				@swag_from(specs=specs)
				@wraps(f)
				def wrapper(*args, **kwargs):
					return f(*args, **kwargs)

				return wrapper
			else:
				@wraps(f)
				def wrapper(*args, **kwargs):
					return f(*args, **kwargs)

				return wrapper

		return decorator

	
