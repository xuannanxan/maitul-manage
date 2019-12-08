#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-13 17:29:28
@LastEditTime: 2019-12-08 12:23:51
@LastEditors: Xuannan
'''


from  app.models.base import db,BaseModel
# 分类
class BlogCategory(BaseModel):
    __tablename__ = "blog_category"
    name = db.Column(db.String(200),nullable=False)
    keywords = db.Column(db.String(255))
    info = db.Column(db.Text)
    icon = db.Column(db.String(100))
    cover = db.Column(db.String(255))
    pid = db.Column(db.Integer, default=0)  # 上级分类,0为最上级
    sort = db.Column(db.Integer, default=0)  # 排序
   

    def __repr__(self):
        return '<BlogCategory %r>' % self.name
