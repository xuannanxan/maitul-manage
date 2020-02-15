#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 09:14:35
@LastEditTime : 2020-02-14 22:06:05
@LastEditors  : Xuannan
'''


from flask import Flask,render_template
from app.ext import init_ext
from app.config import envs,ACCESS_METHODS,ACCESS_ORIGIN
import logging,os,time
from logging.handlers import RotatingFileHandler
from app.apis import api_blueprint
from app.utils.file import make_dir
from app.apis.client import client_api
from app.apis.admin import admin_api
from app.apis.resource import resource_api
from app.apis.cms import cms_api

DEFAULT_BLUEPRINT = (
    (api_blueprint,'/api'),
)


def init_api(app):
    client_api.init_app(app)
    admin_api.init_app(app)
    resource_api.init_app(app)
    cms_api.init_app(app)

def app_log(app):
    log_dir_name = "logs"
    log_file_name = 'logger-' + time.strftime('%Y-%m-%d', time.localtime(time.time())) + '.log'
    log_file_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir)) + os.sep + log_dir_name
    make_dir(log_file_folder)
    log_file_str = log_file_folder + os.sep + log_file_name
    log_level = logging.INFO
    handler = logging.FileHandler(log_file_str, encoding='UTF-8')
    handler.setLevel(log_level)
    logging_format = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(filename)s - %(funcName)s - %(lineno)s - %(message)s')
    handler.setFormatter(logging_format)
    app.logger.addHandler(handler)

# 封装配置蓝本的函数
def config_blueprint(app):
    # 循环读取元组中的蓝本
    for blueprint, prefix in DEFAULT_BLUEPRINT:
        app.register_blueprint(blueprint, url_prefix=prefix)

# @app.errorhandler(404)
# def page_not_found(error):
#     return render_template("common/404.html"),404

# def config_errorhandler(app):
#     # 如果在蓝本定制，则只针对蓝本的错误有效。
#     # 可以使用app_errorhandler定制全局有效的错误显示
#     # 定制全局404错误页面
#     @app.errorhandler(404)
#     def page_not_found(e):
#         return render_template('admin/404.html',e=e)
# 跨域
# def after_request(resp):
#     resp.headers['Access-Control-Allow-Origin'] = ACCESS_ORIGIN
#     resp.headers['Access-Control-Allow-Methods'] = ACCESS_METHODS
#     resp.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type,Authorization'
#     return resp

# 将创建app的动作封装成一个函数
def create_app(env):
    # 创建app实例对象
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object( envs.get(env))
    
    app_log(app)
    # 加载扩展
    init_ext(app)

    # 加载接口
    init_api(app=app)
    # 配置蓝本
    config_blueprint(app)
    # 跨域
    # app.after_request(after_request)

    # # 配置全局错误处理
    # config_errorhandler(app)

    # 返回app实例对象
    return app