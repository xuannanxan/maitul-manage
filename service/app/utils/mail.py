#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-21 10:12:25
@LastEditTime: 2020-03-07 00:31:28
@LastEditors: Xuannan
'''


from flask_mail import Message
from app.ext import mail
from app.config import config
from threading import Thread
from concurrent.futures import ThreadPoolExecutor
import os

executor = ThreadPoolExecutor(2)

config_name = os.environ.get('FLASK_ENV','dev')
mailConfig = config.get(config_name)
class SendMail():
    def __init__(self,subject='',text_body='',html_body='',recipients = [mailConfig.MAIL_ASYNC_RECIPIENTS]):
        self.subject = subject
        self.sender = mailConfig.MAIL_DEFAULT_SENDER
        self.recipients = recipients
        self.text_body = text_body
        self.html_body = html_body
    # 异步发送邮件
    def send_email(self):
        from manager import app
        thr = Thread(target=self.send_async_email,args=[app])
        #使用多线程，在实际开发中，若是不使用异步、多线程等方式，网页会卡住
        thr.start()
        return thr
    def send_async_email(self,app):
        #异步发送将开启一个新的线程,执行上下文已经不在app内,必须with语句进入app上下文才可以执行mail对象
        with app.app_context():
            #主要是Message卡，在线程中初始化
            msg = Message(self.subject, sender=self.sender, recipients=self.recipients)
            msg.body = self.text_body
            msg.html = self.html_body
            mail.send(msg)
