#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 09:57:46
@LastEditTime: 2019-12-13 00:13:19
@LastEditors: Xuannan
'''

import json ,random,time
from collections import defaultdict
from datetime import datetime, date

def object_to_dict(obj):
    """
    对象转字典
    :param model:
    :return:
    """
    data = obj.__dict__
    if "_sa_instance_state" in data:
        del data["_sa_instance_state"]
    if "password" in data:
        del data["password"]
    if "_password" in data:
        del data["_password"]
    if "is_del" in data:
        del data["is_del"]
    return data

def object_to_json(obj):
    data = object_to_dict(obj)
    data = json.dumps(data, default=str, ensure_ascii=False)
    data = json.loads(data)
    return data

def error_to_string(err):
    """
    错误列表转字符串
    :param err:
    :return:
    """
    errors = ''
    for v in err:
        for m in v:
            errors += m
        errors += '\n'
    return errors


def rows_by_date(data,name):
    '''
    按字段对数据进行分类
    '''
    rows_date = defaultdict(list)
    for row in data:
        rows_date[row[name]].append(row)    
    return rows_date

def diyId():
    id = time.strftime('%Y%m%d%H%M%S') + '%d' % random.randint(100,999)
    return id

def mysql_to_json(data):
    return json.loads(json.dumps(data, cls=JsonToDatetime))

class JsonToDatetime(json.JSONEncoder):
    """
    JSONEncoder不知道怎么去把这个数据转换成json字符串的时候，
    它就会调用default()函数，default()函数默认会抛出异常。
    所以，重写default()函数来处理datetime类型的数据。

    """

    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H: %M: %S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)