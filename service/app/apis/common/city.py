#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 10:03:49
@LastEditTime: 2019-12-28 14:27:01
@LastEditors: Xuannan
'''

from flask_restful import Resource,reqparse,abort
from app.models import City

class CitiesResource(Resource):
    def get(self):
        data = City.query.all()
        print(data)
        return {'msg':'111'}