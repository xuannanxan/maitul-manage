#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-21 10:12:25
@LastEditTime: 2020-03-16 11:41:48
@LastEditors: Xuannan
'''
import os
from app import create_app

env = os.environ.get('FLASK_ENV','dev')
# 生成app
app = create_app(env)


if __name__ == '__main__':
    app.run()
 