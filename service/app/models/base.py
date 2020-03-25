#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 10:03:50
@LastEditTime: 2020-03-25 14:49:38
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

    def to_dict(obj):
        """
        对象转字典
        :param model:
        :return:
        """
        model_dict = dict(self.__dict__)
        if "_sa_instance_state" in model_dict:
            del model_dict["_sa_instance_state"]
        if "password" in model_dict:
            del model_dict["password"]
        if "_password" in model_dict:
            del model_dict["_password"]
        if "is_del" in model_dict:
            del model_dict["is_del"]
        return model_dict
            
    # 多个对象
    def dobule_to_dict(self):
        result = {}
        for key in self.__mapper__.c.keys():
            if key not in ("password","_password","is_del"):
                if getattr(self, key) is not None:
                    result[key] = str(getattr(self, key))
                else:
                    result[key] = getattr(self, key)
        return result


class Crud:
    def auto_select(sql,commit=False,count=False):
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
            if count:
                countData = db.session.execute("SELECT FOUND_ROWS() as countnum;")
                countNumber = int((countData.first()).countnum)
                return data,countNumber
            return data
        except Exception as e:
            db.session.rollback()
            current_app.logger.info(e)
            if count:
                return False,0
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

