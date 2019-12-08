'''
@Description: 
@Version: 1.0
@Autor: Allen
@Date: 2019-11-13 17:29:28
@LastEditors: Xuannan
@LastEditTime: 2019-12-08 12:28:02
'''
__author__ = 'Allen xu'
from app.models.base import db,BaseModel
# 内容
class BlogContent(BaseModel):
    __tablename__ = "blog_content"
    title = db.Column(db.String(100),nullable=False)
    keywords = db.Column(db.String(200))
    description = db.Column(db.String(255))# 用于seo的描述信息
    info = db.Column(db.Text)
    content = db.Column(db.Text)
    cover = db.Column(db.String(255))
    click = db.Column(db.BigInteger, default=0)  # 点击数
    sort = db.Column(db.Integer, default=1)  # 排序
    admin_id = db.Column(db.String(255))  # 发布用户
    relation_id = db.Column(db.Integer)  # 关联id
    category_id = db.Column(db.String(32),nullable=False)  # 所属栏目

    def __repr__(self):
        return '<BlogContent %r>' % self.title



