/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-06 22:01:20
 * @LastEditTime : 2020-02-05 21:56:59
 * @LastEditors  : Xuannan
 */

import React ,{useState,useEffect}from 'react'
import { Row,Col ,BackTop,message} from 'antd'
import MyHeader from '../components/MyHeader'
import TopNav from '../components/TopNav'
import Banner from '../components/Banner'
import Advert from '../components/Advert'
import ArticleList from '../components/ArticleList'
import User from '../components/User'
import Footer from '../components/Footer'
import Api from '../config/api'
import axios from 'axios'
import Router from 'next/router'
function Home(props){
  const webconfig = props.webconfig?props.webconfig:{}
  const category = props.category?props.category:[]
  const banner = props.banner?props.banner:[]
  const content = props.content?props.content:[]
  const right_ad = props.right_ad?props.right_ad:[]
  const [ isdown , setIsdown ] = useState(false)
  //如果滚动了就改变header的状态
  const onScroll = () => {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if (t>0){
      setIsdown(true)
    }
    else{
      setIsdown(false)
    }
  }
  //监听滚动动作
  useEffect(() => {
    document.addEventListener('scroll', onScroll, false);
    return () => {
      document.removeEventListener('scroll', onScroll, false);
    };

  }, []);

  return (
    <div>
      <MyHeader webconfig={webconfig} />
      <div className="comm-main">
        <TopNav isdown = {isdown} webconfig={webconfig} category={category}/>
        <Row  type="flex" justify="center">
          <Col className="banner-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
            <Banner banner={banner}/>
          </Col>
          <Col xs={0} sm={0} md={7} lg={5} xl={5}>
            <Advert />
          </Col>
          <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
            <ArticleList content={content}/>
          </Col>

          <Col xs={0} sm={0} md={7} lg={5} xl={5}>
            <User webconfig={webconfig}/>
          </Col>
        </Row>
      </div>
      <Footer/>
      <BackTop />   
    </div>
  )
}
Home.getInitialProps = async ({req,res})=>{
  let date=new Date();
  let month=date.getMonth();
  let day=date.getDate();
  let hour=date.getHours();
  let minute=date.getMinutes();
  let second=date.getSeconds();
  let time=month+'/'+day+'/'+hour+':'+minute+':'+second
  console.log('----->'+time+':Visit the Index page')
  const timeout = (ms, result) => {
    return new Promise(resolve => setTimeout(() => resolve(result), ms));
  };  
  const data = {}
  axios({url:Api.webconfigUrl,method:'GET',params:Api.site}).then((resolve)=>{
    if(resolve.data.status===200){
      data['webconfig']=resolve.data.data
    }
  }).catch(error=>{
    console.log(error.response)
  })
  axios({url:Api.categoryUrl,method:'GET',params:Api.site}).then((resolve)=>{
    if(resolve.data.status===200){
      data['category']=resolve.data.data
    }
  }).catch(error=>{
    console.log(error.response)
  })
  axios({url:Api.adUrl,method:'GET',params:Api.blogBaner}).then((resolve)=>{
    if(resolve.data.status===200){
      data['banner']=resolve.data.data
    }
  }).catch(error=>{
    console.log(error.response)
  })
  axios({url:Api.adUrl,method:'GET',params:Api.blogRightAd}).then((resolve)=>{
    if(resolve.data.status===200){
      data['right_ad']=resolve.data.data
    }
  }).catch(error=>{
    console.log(error.response)
  })
  axios({url:Api.contentUrl,method:'GET',params:Api.site}).then((resolve)=>{
    if(resolve.data.status===200){
      data['content']=resolve.data.data
    }
  }).catch(error=>{
    console.log(error.response)
  })
  return await timeout(300, data);
}
export default Home
