#!/usr/bin/env python
# coding=utf-8
'''
@Description: 后台菜单
@Author: Xuannan
@Date: 2019-12-13 10:35:39
@LastEditTime : 2019-12-20 19:29:13
@LastEditors  : Xuannan
'''

from  app.models.base import db,BaseModel

# 菜单
class Menu(BaseModel):
    __tablename__ = "menu"
    name = db.Column(db.String(100),nullable=False)
    icon = db.Column(db.String(100))
    url = db.Column(db.String(255))
    pid = db.Column(db.String(32), default=0)  # 上级分类,0为最上级
    sort = db.Column(db.Integer, default=0)  # 排序
    last_editor =  db.Column(db.String(20))

    def __repr__(self):
        return '<Menu %r>' % self.name