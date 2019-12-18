#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-18 15:49:20
@LastEditTime: 2019-12-18 17:18:19
@LastEditors: Xuannan
'''

from  app.models.base import db,BaseModel

# 管理员登录日志
class AdminLog(BaseModel):
    __tablename__ = "admin_log"
    username = db.Column(db.String(100))
    ip = db.Column(db.String(100))

    def __repr__(self):
        return '<AdminLog %r>' % self.id
