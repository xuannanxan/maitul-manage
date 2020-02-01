#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2020-01-17 10:34:59
@LastEditTime : 2020-02-01 16:54:50
@LastEditors  : Xuannan
'''
from flask_restful import Api
from app.apis import api_blueprint
from app.apis.resource.ad_space import AdSpaceResource
from app.apis.resource.ad import AdResource
from app.apis.resource.uploads import UploadResource
from app.apis.resource.captcha import CaptchaResource



resource_api = Api(api_blueprint)


# 广告位
resource_api.add_resource(AdSpaceResource,'/resource/adspace')

# 广告
resource_api.add_resource(AdResource,'/resource/ad')
# 上传
resource_api.add_resource(UploadResource,'/upload')
# 验证码
resource_api.add_resource(CaptchaResource,'/captcha')