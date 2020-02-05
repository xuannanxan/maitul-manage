/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 19:44:05
 * @LastEditTime : 2020-02-05 22:19:46
 * @LastEditors  : Xuannan
 */

import React ,{useState} from 'react';
import {List,Icon ,Pagination } from 'antd'
import '../public/style/components/article-list.less'

function ArticleList(props){
    const [content,setContent] = useState(props.content)
    return (
        <>
        <List
          header={<div>最新文章</div>}
          itemLayout="vertical"
          dataSource={content}
          renderItem={item => (
            <List.Item>
              <div className="list-title">{item.title}</div>
              <div className="list-icon">
                <span><Icon type="calendar" /> {item.create_time}</span>
                <span><Icon type={item.category_icon} /> {item.category_name}</span>
                <span><Icon type="fire" /> {item.click}人</span>
              </div>
              <div className="list-context">{item.description}</div>  
            </List.Item>
          )}
        />   
        <Pagination defaultCurrent={1} total={50} /> 
        </>
    )
}

export default ArticleList