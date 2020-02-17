/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 19:44:05
 * @LastEditTime : 2020-02-10 21:59:05
 * @LastEditors: Xuannan
 */

import React ,{useState,useEffect} from 'react';
import {List,Icon ,Breadcrumb,Skeleton,Tag,Pagination} from 'antd'
import Link from 'next/link'

const tagColor = ['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple']

function ArticleList(props){
    const contentList=props.contentList.data?props.contentList.data:[]
    const paginate = props.contentList.paginate?props.contentList.paginate:{}
    const categoryId = props.categoryId?props.categoryId:''
    const currentCategory = props.currentCategory?props.currentCategory:{}
    const search = props.search?props.search:''
    const tag = props.tag?props.tag:''
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
    const goLoading= ()=>{
        setLoading(true)
      }
    const  itemRender=(page, type, originalElement)=>{
        if (type === "page") {
          return <a href={'/list?page='+page+(categoryId?('&id='+categoryId):'')+(search?('&search='+search):'')+(tag?('&tag='+tag):'')}>{page}</a>;
        } else if (type === "prev") {
          return <a href={'/list?page='+(paginate.page-1)+(categoryId?('&id='+categoryId):'')+(search?('&search='+search):'')+(tag?('&tag='+tag):'')}>上一页</a>;
        } else if (type === "next") {
          return <a href={'/list?page='+(paginate.page+1)+(categoryId?('&id='+categoryId):'')+(search?('&search='+search):'')+(tag?('&tag='+tag):'')}>下一页</a>;
        }
      }
    useEffect(()=>{
      setLoading(false)
    },[props])
    return (
      <div>
        <List
          loading={loading}
          header={<div>{tag?`【${tag}】相关...`:search?`【${search}】的搜索结果...`:(categoryId?breadcrumb:'最新文章')}</div>}
          itemLayout="vertical"
          dataSource={contentList}
          renderItem={item => (
            <Skeleton title={true}  loading={loading} active>
            <List.Item>
              <div className="list-title"  onClick={goLoading}>
                <Link href={{pathname:'/detail',query:{id:item.id}}} passHref>
                  <a>{item.title}</a>
                </Link>
              </div>
              <div className="list-icon">
                <span><Icon type="calendar" /> {item.create_time}</span>
                <span><Icon type={item.category_icon?item.category_icon:"folder"} /> {item.category_name}</span>
                <span><Icon type="fire" /> {item.click}人</span>
              </div>
              {item.cover?<div className="list-context"><img src={item.cover} alt={item.title} title={item.title}/></div>:'' }
              {item.description?<div className="list-context">{item.description}</div> :''}
              {item.tags_name?
                <div className="list-context">
                {item.tags_name.split(',').map((tag_name,index)=>{
                  return (
                    <Link key={index+tag_name} href={{pathname:'/list',query:{tag:tag_name}}} passHref>
                      <Tag color={tagColor[Math.floor((Math.random()*tagColor.length))]} onClick={goLoading}  >{tag_name}</Tag>
                    </Link>
                  )
                })}
                </div>:''}
            </List.Item>
            </Skeleton> 
          )}
        /> 
        <Pagination className='center' defaultCurrent={paginate.page?paginate.page:1} total={paginate.total?paginate.total:1} itemRender={itemRender}/>
      </div>  
    )
}

export default ArticleList