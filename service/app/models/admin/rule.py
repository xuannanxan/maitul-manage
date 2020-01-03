#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2020-01-03 13:31:02
@LastEditTime : 2020-01-03 23:38:26
@LastEditors  : Xuannan
'''
from app.models.base import db,BaseModel
# 权限规则
class Rule(BaseModel):
    __tablename__ = "rule"
    name = db.Column(db.String(100),nullable=False)
    url = db.Column(db.String(255))
    menu_id = db.Column(db.String(32))  # 所属菜单
    method = db.Column(db.String(10)) # 请求方法

    def __repr__(self):
        return '<Auth %r>' % self.name