/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 19:44:05
 * @LastEditTime : 2020-02-07 20:24:07
 * @LastEditors  : Xuannan
 */

import React ,{useState,useEffect} from 'react';
import {List,Icon ,Spin ,Breadcrumb} from 'antd'
import {_contentList} from '../config/api'
import '../public/style/components/article-list.less'
import Link from 'next/link'

let pageSize = 10
function ArticleList(props){
    const [contentList,setContentList] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const [total,setTotal] = useState(1)
    const [searchKeywords,setSearchKeywords] = useState('')
    const [categoryId,setCategoryId] = useState('')
    const [isLoadding,setIsLoading] = useState(false)
    //获取内容列表
    const getContentList = (cateId = categoryId,page = currentPage,search=searchKeywords)=>{
      setIsLoading(true)
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
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
      
    }
    const getCurrentList = (page)=>{
      getContentList(categoryId,page)
      setCurrentPage(page)
    }
    const breadcrumb = (props.categoryId && !props.search?
        <Breadcrumb >
          <Breadcrumb.Item href="/index">
            <Icon type="home" /><span>首页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href={"/list?id="+props.categoryId}>
            <Icon type={props.currentCategory.icon} />
            <span>{props.currentCategory.name}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      :'')
    useEffect(()=>{
      getContentList(props.categoryId,1,(props.search?props.search:''))
    },[props.categoryId,props.search])
    return (
        <Spin spinning={isLoadding}>
        <List
          header={<div>{props.search?'搜索结果':(props.categoryId?breadcrumb:'最新文章')}</div>}
          itemLayout="vertical"
          dataSource={contentList}
          pagination={{
            onChange: page => {
              getCurrentList(page);
            },
          pageSize: pageSize,
          total:total,
          defaultCurrent:currentPage,
          current:currentPage,
          }}
          renderItem={item => (
            <List.Item>
              <div className="list-title">
                <Link href={{pathname:'/detail',query:{id:item.id}}}>
                  <a>{item.title}</a>
                </Link>
              </div>
              <div className="list-icon">
                <span><Icon type="calendar" /> {item.create_time}</span>
                <span><Icon type={item.category_icon?item.category_icon:"folder"} /> {item.category_name}</span>
                <span><Icon type="fire" /> {item.click}人</span>
              </div>
              <div className="list-context">{item.description}</div>  
            </List.Item>
          )}
        />   
        </Spin>
    )
}

export default ArticleList