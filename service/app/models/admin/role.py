'''
@Description: 
@Version: 1.0
@Autor: Allen
@Date: 2019-11-13 17:29:28
@LastEditors  : Xuannan
@LastEditTime : 2020-01-03 13:49:46
'''

__author__ = 'Allen xu'
from  app.models.base import db,BaseModel


# 角色
class Role(BaseModel):
    __tablename__ = "role"
    name = db.Column(db.String(100), unique=True,nullable=False)
    rule = db.Column(db.String(512))
  

    def __repr__(self):
        return '<Role %r>' % self.name

# 角色关联权限规则
class RoleRule(db.Model):
    __tablename__ = "role_rule"
    role_id = db.Column(db.String(32), primary_key=True)  # 关联内容id
    rule_id = db.Column(db.String(32), primary_key=True)

    def __repr__(self):
        return '<RoleRule %r>' % self.role_id