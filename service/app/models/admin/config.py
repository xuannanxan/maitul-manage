#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-13 17:29:28
@LastEditTime : 2020-01-20 10:33:13
@LastEditors  : Xuannan
'''
# -*- coding: utf-8 -*- 
# Created by xuannan on 2019-01-26.
__author__ = 'Allen xu'
from  app.models.base import db, BaseModel


# 配置项
class WebConfig(BaseModel):
    __tablename__ = "web_config"
    name = db.Column(db.String(100), nullable=False)
    ename = db.Column(db.String(100), nullable=False)
    moduleID = db.Column(db.String(32), nullable=False) # 配置类型，如系统配置，站点配置
    fieldType = db.Column(db.String(32), nullable=False)  # 字段类型，如文本，数字,文本域，下拉单选，下拉多选，图片，富文本
    placeholder = db.Column(db.String(100))
    values = db.Column(db.Text) #可选值
    value = db.Column(db.Text)
    sort = db.Column(db.Integer, default=0)  # 排序

    def __repr__(self):
        return '<WebConfig %r>' % self.name

