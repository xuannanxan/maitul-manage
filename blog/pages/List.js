/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime : 2020-02-06 23:35:50
 * @LastEditors  : Xuannan
 */
import React,{useState} from 'react'
import { Button,Row,Col } from 'antd'
import TopNav from '../components/TopNav'
import MyHeader from '../components/MyHeader'
import Api from '../config/api'
import axios from 'axios'
import Advert from '../components/Advert'
import ArticleList from '../components/ArticleList'
import User from '../components/User'

const List = (props) => {
  const webconfig = props.webconfig?props.webconfig:{}
  const categoryId = props.category_id?props.category_id:''
  return(
    <div>
      <MyHeader  webconfig={webconfig}/>
      <div>
        <TopNav webconfig={webconfig}/>
        <Row className="comm-main" type="flex" justify="center">
          <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
            <ArticleList categoryId={categoryId}/>
          </Col>

          <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={5}>
            <User webconfig={webconfig}/>
            <Advert />
          </Col>
        </Row>
      </div>
    </div>
  )
    
}
List.getInitialProps = async (content)=>{
  let date=new Date();
  let month=date.getMonth();
  let day=date.getDate();
  let hour=date.getHours();
  let minute=date.getMinutes();
  let second=date.getSeconds();
  let time=month+'/'+day+'/'+hour+':'+minute+':'+second
  console.log('----->'+time+':Visit the List page-'+content.query.id)
  const promise = new Promise(resolve=>{
    axios({url:Api.webconfigUrl,method:'GET',params:Api.site}).then(res=>{
      if(res.data.status===200){
        resolve({webconfig:res.data.data,category_id:content.query.id})
      }
    }).catch(error=>{
      console.log(error.response)
    })
  })
  return await promise
}
export default List
