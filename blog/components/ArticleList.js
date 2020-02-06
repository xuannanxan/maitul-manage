/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 19:44:05
 * @LastEditTime : 2020-02-06 23:33:50
 * @LastEditors  : Xuannan
 */

import React ,{useState,useEffect} from 'react';
import {List,Icon ,Pagination } from 'antd'
import {_contentList} from '../config/api'
import '../public/style/components/article-list.less'

let pageSize = 10
function ArticleList(props){
    const [contentList,setContentList] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const [total,setTotal] = useState(1)
    const [searchKeywords,setSearchKeywords] = useState('')
    const [categoryId,setCategoryId] = useState('')

    //获取内容列表
    const getContentList = (cateId = categoryId,page = currentPage,search=searchKeywords)=>{
      _contentList({category_id:cateId,page:page,paginate:pageSize,search:search}).then(res=>{
        setContentList(res.data.data)
        setTotal(res.data.paginate.total)
      })
      .catch(error=>{
        setContentList([])
      })
      //如果分类不是当前选中的，就重新设置选中分类
      if(cateId !== categoryId){
        setCategoryId(cateId)
      }
      if(search){
        setSearchKeywords(search)
      }
    }
    const getCurrentList = (page)=>{
      getContentList(categoryId,page)
      setCurrentPage(page)
    }
    useEffect(()=>{
      getContentList(props.categoryId,1)
    },[props])
    return (
        <>
        <List
          header={<div>最新文章</div>}
          itemLayout="vertical"
          dataSource={contentList}
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
        <Pagination
         total={total}
         current={currentPage}
         defaultCurrent={currentPage}
         onChange={(page)=>getCurrentList(page)}
        /> 
        </>
    )
}

export default ArticleList