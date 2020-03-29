#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-13 17:29:28
@LastEditTime: 2020-02-26 22:17:59
@LastEditors: Xuannan
'''


from  app.models.base import db,BaseModel
# 分类
class InfoCategory(BaseModel):
    __tablename__ = "info_category"
    name = db.Column(db.String(200),nullable=False)
    keywords = db.Column(db.String(255))
    description = db.Column(db.String(255))
    icon = db.Column(db.String(100))
    cover = db.Column(db.String(255))
    pid = db.Column(db.String(32), default=0)  # 上级分类,0为最上级
    sort = db.Column(db.Integer, default=0)  # 排序
    module = db.Column(db.String(255))
    lang = db.Column(db.String(20))

    def __repr__(self):
        return '<InfoCategory %r>' % self.name
