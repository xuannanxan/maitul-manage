/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-06 22:01:20
 * @LastEditTime : 2020-02-06 21:37:27
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
  const webconfig = props?props:{}
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
        <TopNav isdown = {isdown} webconfig={webconfig}/>
        <Row  type="flex" justify="center">
          <Col xs={24} sm={24} md={16} lg={15} xl={15}  >
            <Col className="banner-left" span={24}  >
              <Banner/>
            </Col>
            <Col className="comm-left" span={24}  >
              <ArticleList/>
            </Col>
          </Col>

          <Col xs={0} sm={0} md={8} lg={5} xl={5}>
            <Col span={24}>
              <Advert/>
            </Col>
            
            <Col  span={24}>
              <User webconfig={webconfig}/>
            </Col>
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
  const promise = new Promise(resolve=>{
    axios({url:Api.webconfigUrl,method:'GET',params:Api.site}).then(res=>{
      if(res.data.status===200){
        resolve(res.data.data)
      }
    }).catch(error=>{
      console.log(error.response)
    })
  })
  return await promise
}
export default Home
