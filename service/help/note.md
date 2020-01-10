<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-08 10:03:48
 * @LastEditTime : 2020-01-10 10:43:43
 * @LastEditors  : Xuannan
 -->
数据迁移
    初始化    
    python manager.py db init  仅第一次使用
    迁移      
    python manager.py db migrate
    更新      
    python manager.py db upgrade
启动服务
    python manager.py runserver
接口文档
    http://localhost:5000/apidocs/