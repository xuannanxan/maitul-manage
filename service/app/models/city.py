#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-28 12:34:25
@LastEditTime: 2019-12-08 10:34:45
@LastEditors: Xuannan
'''
from app.models.base import BaseModel,db
# 城市的数据模型
class City(BaseModel):
    __tablename__ = "city"  
    pid = db.Column(db.String(32), default='0')
    city_name = db.Column(db.String(100))
    city_code = db.Column(db.String(100))
    short_name = db.Column(db.String(100))


    def __repr__(self):
        return '<City %r>' % self.city_name