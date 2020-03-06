#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-08 10:03:49
@LastEditTime: 2020-03-06 21:49:57
@LastEditors: Xuannan
'''
# -*- coding: utf-8 -*- 
# Created by xuannan on 2019-01-02.
import os
from redis import Redis
from app.secret import secret as sec
import logging
# 自定义变量
# 文件上传的位置
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static/uploads')
# 水印
WATER_MARK = os.path.join(BASE_DIR, 'static/watermark.png')
# 每页的数量
PAGINATE_NUM = 10


# 通用配置
class Config(object):
    DEBUG = False
    TESTING = False
    LOG_LEVEL = logging.INFO
    #允许的文件格式
    FILE_EXTENSIONS = set(['txt', 'pdf','rar', 'zip','doc', 'docx','xls', 'xlsx', 'ppt', 'pptx','db','png', 'jpg', 'jpeg', 'gif'])
    IMAGE_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif'])
    #图片大小
    MAX_CONTENT_LENGTH = 8 * 1024 * 1024
    # 数据库配置
    # 无警告
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # 自动提交
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True    
    # 发邮件 配置
    MAIL_SUPPRESS_SEND = False
    MAIL_PORT = 465
    MAIL_USE_TLS = False   
    MAIL_USE_SSL = True
    MAIL_DEBUG = False
    def __init__(self,config_name='produce'):
        if config_name=='dev':
            self.MAIL_DEBUG = True
            self.DEBUG = True
            self.LOG_LEVEL = logging.DEBUG
        secret = sec(config_name)
        self.SQLALCHEMY_DATABASE_URI = "{}+{}://{}:{}@{}:{}/{}?charset=utf8".format(
            'mysql', 
            'pymysql',
            secret.get('DB_USERNAME'),
            secret.get('DB_PASSWORD'),
            secret.get('DB_HOST'), 
            secret.get('DB_PORT'),
            secret.get('DB_DATABASE'))
        self. MAIL_SERVER = secret.get('MAIL_SERVER') 
        self.MAIL_USERNAME = secret.get('MAIL_USERNAME')
        self.MAIL_DEFAULT_SENDER =secret.get('MAIL_USERNAME')
        self.MAIL_ASYNC_RECIPIENTS = secret.get('MAIL_ASYNCNAME') 
        self.MAIL_PASSWORD = secret.get('MAIL_PASSWORD') 
        self.SECRET_KEY=secret.get('SECRET_KEY') 
        #设置CACHE
        self.CACHE_TYPE = 'redis'
        self.CACHE_REDIS_HOST = secret.get('REDIS_HOST')
        self.CACHE_REDIS_PORT = secret.get('REDIS_PORT')
        self.CACHE_REDIS_PASSWORD = secret.get('REDIS_PASSWORD') 
        self.CACHE_DEFAULT_TIMEOUT = 300
        # 设置session
        self.SESSION_TYPE = 'redis'
        self.SESSION_PERMANENT = True  # 如果设置为True，则关闭浏览器session就失效
        self.SESSION_USE_SIGNER = True # 是否对发送到浏览器上 session:cookie值进行加密
        self.SESSION_REDIS=  Redis(host=secret.get('REDIS_HOST'), port=secret.get('REDIS_PORT'), password= secret.get('REDIS_PASSWORD') ,db=secret.get('REDIS_DB'))

config  = {
    'dev' :Config('dev'),
    'produce':Config,
    'default':Config('dev'),
}