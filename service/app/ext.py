#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 09:14:35
@LastEditTime: 2020-03-01 20:07:26
@LastEditors: Xuannan
'''
import os
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy as _SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail
from flask_caching  import Cache
from app.apis import api_blueprint
from flask import current_app
from contextlib import contextmanager
# 数据提交的上下文
class SQLAlchemy(_SQLAlchemy):
    @contextmanager
    def autoCommit(self):
        try:
            yield
            self.session.commit()
        except Exception as e:
            self.session.rollback() 
            current_app.logger.error(e)
            return False

# 创建对象
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
csrf = CSRFProtect()
#缓存
cache = Cache(with_jinja2_ext=False)
csrf.exempt(api_blueprint)


# 初始化拓展包
def init_ext(app):
    db.init_app(app)
    migrate.init_app(app,db)
    cache.init_app(app)
    mail.init_app(app)
    csrf.init_app(app)
    # 只有开发环境可以生产接口文档
    if app.config['DEBUG']:
        from flasgger import Swagger
        Swagger(app)

