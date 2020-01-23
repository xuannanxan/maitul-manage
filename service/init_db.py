#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-13 10:35:39
@LastEditTime : 2020-01-10 17:49:28
@LastEditors  : Xuannan
'''
# -*- coding: utf-8 -*- 
# Created by xuannan on 2019-01-31.
__author__ = 'Allen xu'
import os
from werkzeug.security import check_password_hash,generate_password_hash
import json,pymysql
from  app.secret import secret
env = os.environ.get('FLASK_ENV','dev')
secret = secret(env)


db = pymysql.Connect(host=secret.get('DB_HOST'),port=secret.get('DB_PORT'),user=secret.get('DB_USERNAME'),password=secret.get('DB_PASSWORD'),db=secret.get('DB_DATABASE'),charset='utf8')

def load_data(file):
    with open(file,'r',encoding='utf-8') as json_file:
        json_str = json_file.read()
        return json.loads(json_str)
     

def insert_cities(city_json):
    cities = city_json.get('returnValue')
    keys = cities.keys()
    cursor = db.cursor()
    for k in keys:
        for city in cities[k]:
            id = city.get('id')
            parentId = city.get('parentId')
            regionName = city.get('regionName')
            cityCode = city.get('cityCode')
            pinYin = city.get('pinYin')
            cursor.execute("insert into city(id,pid,city_name,city_code,short_name) values('%s','%s','%s','%s','%s');"%(id,parentId,regionName,cityCode,pinYin))
    db.commit()

def insert_menus(data):
    menus = data.get('menus')
    cursor = db.cursor()
    for v in menus:
        id = v.get("id")
        name = v.get("name")
        icon = v.get("icon")
        url = v.get("url")
        pid = v.get("pid")
        sort = v.get("sort")
        is_del = int(v.get("is_del"))
        cursor.execute("insert into menu(id,name,icon,url,pid,sort,is_del) values('%s','%s','%s','%s','%s','%d','%d');"%(id,name,icon,url,pid,sort,is_del))
    db.commit()

def insert_rules(data):
    rules = data.get('rules')
    cursor = db.cursor()
    for v in rules:
        id = v.get("id")
        name = v.get("name")
        method = v.get("method")
        url = v.get("url")
        menu_id = v.get("menu_id")
        is_del = int(v.get("is_del"))
        cursor.execute("insert into rule(id,name,method,url,menu_id,is_del) values('%s','%s','%s','%s','%s','%d');"%(id,name,method,url,menu_id,is_del))
    db.commit()

def init_data():
    password = input("即将初始化数据，请输入操作密码：")
    if check_password_hash('pbkdf2:sha256:150000$WxouU1qd$82060dd41e04168e5650f9f2b75360142e98a8e65e14c24a053fd56e8b09f502',password):
        check = input("确认添加初始化吗？如果二次初始化，可能会导致数据重复，1为确认，其他为取消：")
        if check == '1':
            init_json = load_data('./data/init_data.json')
            city_json = load_data('./data/cities.json')
            insert_rules(init_json)
            insert_menus(init_json)
            
            insert_cities(city_json)
            print("初始化成功")
        else:
            print("已取消操作")
            return
    else:
        print("密码错误，已取消操作")
        return

if __name__ == '__main__':
    init_data()