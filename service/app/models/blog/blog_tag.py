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
class BlogTag(BaseModel):
    __tablename__ = "blog_tag"
    name = db.Column(db.String(100), nullable=False)
    sort = db.Column(db.Integer, default=0)  # 排序
    last_editor =  db.Column(db.String(20))

    def __repr__(self):
        return '<BlogTag %r>' % self.name

# 关联的标签
class BlogTagRelation(db.Model):
    __tablename__ = "blog_tag_relation"
    content_id = db.Column(db.String(32), primary_key=True)  # 关联内容id
    tag_id = db.Column(db.String(32), primary_key=True)

    def __repr__(self):
        return '<BlogTagRelation %r>' % self.content_id