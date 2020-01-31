'''
@Description: 
@Version: 1.0
@Autor: Allen
@Date: 2019-11-13 17:29:28
@LastEditors: Xuannan
@LastEditTime: 2019-12-18 15:54:10
'''


__author__ = 'Allen xu'
from  app.models.base import db, BaseModel


# 标签
class MaitulTag(BaseModel):
    __tablename__ = "maitul_tag"
    name = db.Column(db.String(100), nullable=False)
    sort = db.Column(db.Integer, default=0)  # 排序

    def __repr__(self):
        return '<MaitulTag %r>' % self.name

