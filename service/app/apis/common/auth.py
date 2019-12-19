#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-12-16 12:42:17
@LastEditTime : 2019-12-19 21:39:48
@LastEditors  : Xuannan
'''
import jwt, datetime, time
from flask import jsonify
from flask_restful import abort
from app.apis.api_constant import *
from flask import current_app


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
                current_app.config['SECRET_KEY'],
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
            payload = jwt.decode(auth_token, current_app.config['SECRET_KEY'], options={'verify_exp': False})
            if ('data' in payload and 'id' in payload['data']):
                return payload
            else:
                raise jwt.InvalidTokenError
        except jwt.ExpiredSignatureError:
            abort(RET.Forbidden,msg='Token已过期',status=RET.REENTRY)
        except jwt.InvalidTokenError:
            abort(RET.Forbidden,msg='无效Token',status=RET.REENTRY)

    @staticmethod
    def header_to_token(auth_header,prefix):
        if not auth_header:
            abort(RET.Forbidden,msg='请登陆!',status=RET.REENTRY)
        auth_tokenArr = auth_header.split(" ")
        if (not auth_tokenArr or auth_tokenArr[0] != prefix or len(auth_tokenArr) != 2):
            abort(RET.Forbidden,msg='Token验证头错误',status=RET.REENTRY)
        else:
            return auth_tokenArr[1]
           