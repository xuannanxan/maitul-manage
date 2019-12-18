#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-17 22:23:06
@LastEditTime: 2019-12-18 11:57:02
@LastEditors: Xuannan
'''


class ParamFiled:
	def __init__(self, name, description, enum, required, default):
		self.name = name
		self.description = description
		self.enum = enum
		self.required = required
		self.default = default

	@property
	def data(self):	
			param ={
				"name": self.name,
				"in": self.site,
				"type": self.type,
				"description": self.description,
				"required": self.required,
				"default": self.default
			}
			if self.enum:
				param['enum']=self.enum
			return param


class IntegerQueryFiled(ParamFiled):
	def __init__(self, name, description, enum=None, required=None, default=None):
		self.type = 'integer'
		self.site = 'query'
		super().__init__(name, description, enum, required, default)


class IntegerPathFiled(ParamFiled):
	def __init__(self, name, description, enum=None, required=None, default=None):
		self.type = 'integer'
		self.site = 'path'
		super().__init__(name, description, enum, required, default)


class StringQueryFiled(ParamFiled):
	def __init__(self, name, description, enum=None, required=None, default=None):
		self.type = 'string'
		self.site = 'query'
		super().__init__(name, description, enum, required, default)


class StringPathFiled(ParamFiled):
	def __init__(self, name, description, enum=None, required=None, default=None):
		self.type = 'string'
		self.site = 'path'
		super().__init__(name, description,enum, required, default)


class BooleanQueryFiled(ParamFiled):
	def __init__(self, name, description, enum=None, required=None, default=None):
		self.type = 'boolean'
		self.site = 'query'
		super().__init__(name, description, enum, required, default)


class BooleanPathFiled(ParamFiled):
	def __init__(self, name, description, enum=None, required=None, default=None):
		self.type = 'boolean'
		self.site = 'path'
		super().__init__(name, description, enum, required, default)


class BodyFiled(ParamFiled):
	def __init__(self, name, description, enum=None, required=None, default=None):
		self.site = 'body'
		super().__init__(name, description, enum, required, default)
