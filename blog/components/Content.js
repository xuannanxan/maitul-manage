/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 19:44:05
 * @LastEditTime : 2020-02-07 19:24:19
 * @LastEditors  : Xuannan
 */

import React ,{useState,useEffect} from 'react';
import {List,Icon ,Spin ,Breadcrumb} from 'antd'
import {_contentList} from '../config/api'


let pageSize = 10
function Content(props){
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
        
        </Spin>
    )
}

export default Content