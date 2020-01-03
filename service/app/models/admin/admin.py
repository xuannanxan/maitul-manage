'''
@Description: 
@Version: 1.0
@Autor: Allen
@Date: 2019-11-18 17:04:48
@LastEditors: Xuannan
@LastEditTime: 2019-12-18 16:06:17
'''
__author__ = 'Allen xu'
from werkzeug.security import check_password_hash,generate_password_hash
from app.models.base import db,BaseModel


# 管理员
class Admin(BaseModel):
    __tablename__ = "admin"
    username = db.Column(db.String(64), nullable=False)
    _password = db.Column('password',db.String(128),nullable=False)
    is_super = db.Column(db.SmallInteger, default=0)  # 是否超级管理员 1为是 0为否
    name = db.Column(db.String(20))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    last_editor =  db.Column(db.String(20))
    
    def __repr__(self):
        return '<Admin %r>' % self.username
    @property
    def password(self):
        """
        读取属性
        :return:
        """
        return self._password

    @password.setter
    def password(self,raw):
        """
        为password写入属性
        :param raw:明文密码
        :return:加密后的密码
        """
        self._password = generate_password_hash(raw)


    def check_pwd(self, raw):
        """
        密码验证
        :param raw:
        :return:
        """
        return check_password_hash(self._password, raw)
    # 继承了flask-login的UserMixin，主键为id，无需重新定义
    # def get_id(self):
    #     return self.id
# 账号关联角色
class AdminRole(db.Model):
    __tablename__ = "admin_role"
    role_id = db.Column(db.String(32), primary_key=True)  # 关联内容id
    admin_id = db.Column(db.String(32), primary_key=True)

    def __repr__(self):
        return '<AdminRole %r>' % self.admin_id