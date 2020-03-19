#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2020-01-17 10:34:59
@LastEditTime: 2020-03-19 15:23:57
@LastEditors: Xuannan
'''
from flask_restful import Api
from app.apis import api_blueprint
from app.apis.resource.ad_space import AdSpaceResource
from app.apis.resource.ad import AdResource
from app.apis.resource.uploads import UploadResource
from app.apis.resource.captcha import CaptchaResource
from app.apis.resource.message import MessageResource,ShowMessageResource
from app.apis.resource.site_data import SiteDataResource


resource_api = Api(api_blueprint)


# 广告位
resource_api.add_resource(AdSpaceResource,'/resource/adspace')

# 广告
resource_api.add_resource(AdResource,'/resource/ad')
# 上传
resource_api.add_resource(UploadResource,'/upload')
# 验证码
resource_api.add_resource(CaptchaResource,'/captcha')

# 留言
resource_api.add_resource(MessageResource,'/message')

# 用于展示的留言
resource_api.add_resource(ShowMessageResource,'/message/show')

# 站点数据
resource_api.add_resource(SiteDataResource,'/<site>/data')