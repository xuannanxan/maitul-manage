#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 10:03:50
@LastEditTime: 2020-02-05 13:29:50
@LastEditors: Xuannan
'''
# -*- coding: utf-8 -*- 
# Created by xuannan on 2019-01-26.
__author__ = 'Allen xu'
import traceback
from copy import deepcopy
from app.utils import object_to_dict,diyId
from sqlalchemy.sql import and_,or_,not_


import uuid
from datetime import datetime
from flask import current_app
from app.ext import db

class BaseModel(db.Model):
    #不需要创建base表
    __abstract__ = True
    #所有模型继承的字段
    id = db.Column(db.String(32),primary_key=True,default=diyId)
    create_time = db.Column(db.DateTime, nullable=True,default=datetime.now)
    update_time = db.Column(db.DateTime, nullable=True, default=datetime.now, onupdate=datetime.now)  # 记录的更新时间
    last_editor =  db.Column(db.String(20))
    is_del = db.Column(db.String(32), default=0)  # 状态，0为未删除，其他为已删除


    def set_attrs(self,attrs_dict):
        for key,value in attrs_dict.items():
            if hasattr(self,key) and key != "id":
                setattr(self,key,value)
        # setattr(self,'create_time',datetime.now)

    def add(self):
        with db.autoCommit():
            db.session.add(self)
        return True

    def updata(self):
        with db.autoCommit():
            return True

    def clean(self):
        '''
        清除数据，物理删除，谨慎操作
        '''
        with db.autoCommit():
            db.session.delete(self)
        return True
       

    def delete(self):
        '''
        逻辑删除
        '''
        with db.autoCommit():
            self.is_del = self.id
        return True



class Crud:
    def auto_select(sql,commit=False):
        """
        提交sql语句
        :sql :
        :return: 提示信息
        """
        try:
            data = db.session.execute(sql)
            if commit:
                db.session.commit()
            db.session.close()
            return data
        except Exception as e:
            db.session.rollback()
            current_app.logger.info(e)
            return False
        
    def add_all(data):
        with db.autoCommit():
            db.session.add_all(data)
        return data

    def clean_all(lst):
        # 彻底删除多行
        try:
            if type(lst).__name__ == 'list' :
                for v in lst:
                    db.session.delete(v)
                db.session.commit()
                return len(lst)
            return False
        except Exception as e:
            db.session.rollback()
            current_app.logger.info(e)
            return False

