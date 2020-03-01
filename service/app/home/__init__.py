#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2020-03-01 19:49:20
@LastEditTime: 2020-03-01 20:10:17
@LastEditors: Xuannan
'''
from flask import Blueprint

home_blueprint = Blueprint('home_blueprint', __name__)

from .index import index


