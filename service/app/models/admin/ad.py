#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 10:03:49
@LastEditTime: 2020-02-20 19:16:36
@LastEditors: Xuannan
'''
# -*- coding: utf-8 -*- 
# Created by xuannan on 2019-01-26.
__author__ = 'Allen xu'
from  app.models.base import db,BaseModel

# 广告
class Ad(BaseModel):
    __tablename__ = "ad"
    name = db.Column(db.String(100),nullable=False)
    info = db.Column(db.Text)
    url = db.Column(db.String(255))
    img = db.Column(db.String(255))
    sort = db.Column(db.Integer, default=0)  # 排序
    space_id = db.Column(db.String(32))  # 关联广告位
    

    def __repr__(self):
        return '<Ad %r>' % self.name


# 广告位
class AdSpace(BaseModel):
    __tablename__ = "ad_space"
    name = db.Column(db.String(100),nullable=False)
    ename = db.Column(db.String(100),nullable=False)
    sort = db.Column(db.Integer, default=0)  # 排序
    last_editor =  db.Column(db.String(20))

    def __repr__(self):
        return '<AdSpace %r>' % self.name