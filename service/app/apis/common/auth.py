#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-16 12:42:17
@LastEditTime: 2019-12-16 16:44:28
@LastEditors: Xuannan
'''
import jwt, datetime, time
from flask import jsonify
from app.config import envs
from app.ext import env
from flask_restful import abort
from app.apis.api_constant import *


SECRET_KEY = (envs.get(env)).SECRET_KEY
class Auth():
    @staticmethod
    def encode_auth_token(user_id):
        """
        生成认证Token
        :param user_id: string
        :return: string
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=10),
                'iat': datetime.datetime.utcnow(),
                'iss': 'ken',
                'data': {
                    'id': user_id,
                    'login_time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            }
            token = jwt.encode(
                payload,
                SECRET_KEY,
                algorithm='HS256'
            )
            return str(token,'utf-8')
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        验证Token
        :param auth_token:
        :return: integer|string
        """
        try:
            # payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'), leeway=datetime.timedelta(seconds=10))
            # 取消过期时间验证
            payload = jwt.decode(auth_token, SECRET_KEY, options={'verify_exp': False})
            if ('data' in payload and 'id' in payload['data']):
                return payload
            else:
                raise jwt.InvalidTokenError
        except jwt.ExpiredSignatureError:
            abort(RET.Forbidden,msg='Token已过期')
        except jwt.InvalidTokenError:
            abort(RET.Forbidden,msg='无效Token')

    @staticmethod
    def header_to_token(auth_header):
        auth_tokenArr = auth_header.split(" ")
        if (not auth_tokenArr or auth_tokenArr[0] != 'JWT' or len(auth_tokenArr) != 2):
            abort(RET.Forbidden,msg='Token验证头错误')
        else:
            return auth_tokenArr[1]
           