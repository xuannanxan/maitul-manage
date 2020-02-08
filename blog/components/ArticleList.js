/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 19:44:05
 * @LastEditTime : 2020-02-08 22:23:00
 * @LastEditors  : Xuannan
 */

import React ,{useState,useEffect} from 'react';
import {List,Icon ,Breadcrumb,Skeleton,Button} from 'antd'
import Link from 'next/link'
import Router from 'next/router'
function ArticleList(props){
    const contentList=props.contentList.data?props.contentList.data:[]
    const paginate = props.contentList.paginate?props.contentList.paginate:{}
    const categoryId = props.categoryId?props.categoryId:''
    const currentCategory = props.currentCategory?props.currentCategory:{}
    const search = props.search?props.search:''
    const [loading,setLoading] = useState(true)
    //获取内容列表
    const breadcrumb = (categoryId && !search?
        <Breadcrumb >
          <Breadcrumb.Item href="/index">
            <Icon type="home" /><span>首页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href={"/list?id="+categoryId}>
            <Icon type={currentCategory.icon} />
            <span>{currentCategory.name}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      :'')
    useEffect(()=>{
      setLoading(false)
    },[])
    return (
        <List
          loading={loading}
          pagination={{
            onChange: page => {
              Router.push('/list?page='+page+(categoryId?('&id='+categoryId):'')+(search?('&search='+search):'')) ;
            },
            pageSize: paginate.per_page?paginate.per_page:10,
            total: paginate.total?paginate.total:1,
            current:paginate.page?paginate.page:1,
          }}
 
          header={<div>{search?'搜索结果':(categoryId?breadcrumb:'最新文章')}</div>}
          itemLayout="vertical"
          dataSource={contentList}
          renderItem={item => (
            <Skeleton title={true}  loading={loading} active>
            <List.Item>
              <div className="list-title">
                <Link href={{pathname:'/detail',query:{id:item.id}}} passHref>
                  <a>{item.title}</a>
                </Link>
              </div>
              <div className="list-icon">
                <span><Icon type="calendar" /> {item.create_time}</span>
                <span><Icon type={item.category_icon?item.category_icon:"folder"} /> {item.category_name}</span>
                <span><Icon type="fire" /> {item.click}人</span>
              </div>
              {item.cover?<div className="list-context"><img src={item.cover}/></div>:'' }
              <div className="list-context">{item.description}</div>  
            </List.Item>
            </Skeleton> 
          )}
        />   
    )
}

export default ArticleList