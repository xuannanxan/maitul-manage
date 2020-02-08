/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 19:44:05
 * @LastEditTime : 2020-02-08 15:03:17
 * @LastEditors  : Xuannan
 */

import React ,{useState,useEffect} from 'react';
import {List,Icon ,Breadcrumb,Skeleton,Button} from 'antd'
import {_contentList} from '../config/api'
import Link from 'next/link'

let pageSize = 10
function ArticleList(props){
    const [contentList,setContentList] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const [total,setTotal] = useState(1)
    const [searchKeywords,setSearchKeywords] = useState('')
    const [categoryId,setCategoryId] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [ initLoading , setInitLoading ] = useState(false)
    //获取内容列表
    const getContentList = (cateId = categoryId,page = currentPage,search=searchKeywords)=>{
      setIsLoading(true)
      _contentList({category_id:cateId,page:page,paginate:pageSize,search:search}).then(res=>{
        setContentList(res.data.data)
        setTotal(res.data.paginate.total)
        setIsLoading(false)
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
      if(page !== currentPage){
        setCurrentPage(page)
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
    }

    const  onLoadMore = () => {
      setInitLoading(true)
      if(total/pageSize>currentPage){
        setCurrentPage(currentPage+1)
        setContentList(contentList.concat([...new Array(pageSize)].map(() => ({ loading: true, name: {} }))))
        _contentList({cateId:categoryId,page:currentPage+1,paginate:pageSize,search:searchKeywords}).then(res=>{
          setContentList(contentList.concat(res.data.data))
          setTotal(res.data.paginate.total)
          setInitLoading(false)
        })
      }
      setTimeout(() => {
        setInitLoading(false)
      }, 500);
    };
    const loadMore =
      !initLoading && !isLoading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          {total/pageSize>currentPage?
          <Button onClick={onLoadMore}>loading more</Button>
          :(contentList&&contentList.length?'只有这么多了...':'')}
        </div>
      ) : null;
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
        <List
          loading={isLoading}
          loadMore={loadMore}
          header={<div>{props.search?'搜索结果':(props.categoryId?breadcrumb:'最新文章')}</div>}
          itemLayout="vertical"
          dataSource={contentList}
          renderItem={item => (
            <Skeleton title={true}  loading={item.loading} active>
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
            </Skeleton> 
          )}
        />   
    )
}

export default ArticleList