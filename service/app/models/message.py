# -*- coding: utf-8 -*- 
# Created by xuannan on 2019-01-26.
__author__ = 'Allen xu'
from  app.models.base import db, BaseModel


# 留言

class Message(BaseModel):
    __tablename__ = "message"
    contact = db.Column(db.String(100))  # 联系方式
    email = db.Column(db.String(100))  # 邮箱
    name = db.Column(db.String(100))  # 联系人
    info = db.Column(db.Text)  # 留言内容
    ip = db.Column(db.String(100))  # IP地址
    uid = db.Column(db.String(255))  # 留言用户
    reply = db.Column(db.Text)  # 回复内容
    show = db.Column(db.SmallInteger, default=0)  # 是否展示，1为展示，0为不展示
    site = db.Column(db.String(20))  # 所属站点
    url = db.Column(db.String(200))  # 所在页面
    def __repr__(self):
        return '<Message %r>' % self.id

