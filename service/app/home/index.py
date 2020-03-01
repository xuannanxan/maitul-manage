#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 19:28:32
@LastEditTime: 2020-03-01 20:08:46
@LastEditors: Xuannan
'''
from app.home import home_blueprint

@home_blueprint.route('/')
def index():
    return 'Hello world'


  
        