#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2020-03-23 10:10:44
@LastEditTime: 2020-03-23 10:10:49
@LastEditors: Xuannan
'''
from app.models.base import db,BaseModel
# 语言设置
class Lang(BaseModel):
    __tablename__ = "lang"
    name = db.Column(db.String(20))
    ename = db.Column(db.String(20),nullable=False)
    sort = db.Column(db.Integer, default=0)  # 排序
   

    def __repr__(self):
        return '<Lang %r>' % self.name