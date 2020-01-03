'''
@Description: 
@Version: 1.0
@Autor: Allen
@Date: 2019-11-13 17:29:28
@LastEditors: Xuannan
@LastEditTime: 2019-12-18 15:56:18
'''
__author__ = 'Allen xu'
from app.models.base import db,BaseModel
# 内容
class BlogContent(BaseModel):
    __tablename__ = "blog_content"
    title = db.Column(db.String(100),nullable=False)
    keywords = db.Column(db.String(200))
    description = db.Column(db.String(255))# 用于seo的描述信息
    content = db.Column(db.Text)
    cover = db.Column(db.String(255))
    click = db.Column(db.BigInteger, default=0)  # 点击数
    sort = db.Column(db.Integer, default=1)  # 排序
    author = db.Column(db.String(20))  # 发布用户
    category_id = db.Column(db.String(32),nullable=False)  # 所属分类

    def __repr__(self):
        return '<BlogContent %r>' % self.title



