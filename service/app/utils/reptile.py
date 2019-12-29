#!/usr/bin/env python
# coding=utf-8
'''
@Description: 
@Author: Xuannan
@Date: 2019-11-25 10:41:30
@LastEditTime: 2019-11-25 13:10:40
@LastEditors: Xuannan
'''

from lxml import html
from urllib import parse

# 爬取列表
def getReptileList(url,dom):
    # 获取网站数据
    r = requests.get(url)
    etree = html.etree
    selector = etree.HTML(r.content)
    domList = selector.xpath(dom)
    lst = [full_url(url,dm) for dm in domList]
    return lst

# 爬取内容数据
def getReptileContent(url,content_obj):
    r = requests.get(url)
    etree = html.etree
    selector = etree.HTML(r.content)
    content_data = {}
    for key in content_obj:
        # 回避空字典
        if content_obj[key]:
            catch_data = selector.xpath(content_obj[key])
            # 抓不到数据就跳过
            if len(catch_data) < 1:
                return
            arr = [dom if not isEtreeElement(dom) else etree.tostring(dom,encoding="utf-8", method='html').decode(encoding='utf-8') for dom in catch_data]
            str_dom = ''.join(arr)
            #下载图片，替换URL
            content_data[key] =  replaceSrc(str_dom,url)
    return content_data

def full_url(url,relative_url):
    return parse.urljoin(url, relative_url)


#下载图片并替换HTML中的图片链接
def replaceSrc(content,url):
    etree = html.etree
    selector = etree.HTML(content)
     #将页面上图片的链接加入list
    imgs = selector.xpath("//img/@src")
    for img in imgs:
        src = full_url(url,img)
        new_src = downImage(src)
        content = content.replace(img,new_src)
    return content
#是否为<class 'lxml.etree._Element'>
def isEtreeElement(obj):
    if str(type(obj))=="<class 'lxml.etree._Element'>":
        return True
    else:
        return False
#下载图片
def downImage(src):
    response = requests.get(src)
    im = Image.open(BytesIO(response.content))
    # 文件目录
    path = time.strftime('%Y%m%d')
    d = UPLOAD_FOLDER+'/'+path
    if not os.path.exists(d):
        os.makedirs(d)
    # 文件扩展名
    ext = os.path.splitext(src)[1]
    # 定义文件名，年月日时分秒随机数
    fn = time.strftime('%Y%m%d%H%M%S')
    fn = fn + '_%d' % random.randint(100,999)
    # 重写合成文件名
    im.save(os.path.join(d, fn + ext))
    return '/static/uploads/'+path+'/'+fn + ext