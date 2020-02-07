/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-06 22:01:20
 * @LastEditTime : 2020-02-07 16:06:01
 * @LastEditors  : Xuannan
 */

import React ,{useState,useEffect}from 'react'
import { Row,Col ,BackTop,message,Affix} from 'antd'
import Header from '../components/Header'
import TopNav from '../components/TopNav'
import Banner from '../components/Banner'
import Advert from '../components/Advert'
import ArticleList from '../components/ArticleList'
import Author from '../components/Author'
import Footer from '../components/Footer'
import Api from '../config/api'
import axios from 'axios'
import Router from 'next/router'
import Error from './_error'
function Home(props){
  if (props.webconfig.status) {
    return <Error statusCode={props.webconfig.status} />
  }
  const category = props.category?props.category:[]
  const webconfig = props.webconfig?props.webconfig:{}
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
      <Header webconfig={webconfig} />
      <div className="comm-main">
        <TopNav isdown = {isdown} webconfig={webconfig} category={category}/>
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
                <Advert/>
            <Affix offsetTop={60}>
                <Author webconfig={webconfig}/>
            </Affix>
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
  const webconfig = new Promise(resolve=>{
    axios({url:Api.webconfigUrl,method:'GET',params:Api.site}).then(res=>{
      if(res.data.status===200){
        resolve(res.data.data)
      }else{
        resolve(res)
      }
    }).catch(error=>{
      console.log(error.response)
      resolve({status:error.response?error.response.status:502})
    })
  })
  const category = new Promise(resolve=>{
    axios({url:Api.categoryUrl,method:'GET',params:Api.site}).then(res=>{
      if(res.data.status===200){
        resolve(res.data.data)
      }else{
        resolve(res)
      }
    }).catch(error=>{
      console.log(error.response)
      resolve({status:error.response?error.response.status:502})
    })
  })
  return  {webconfig:await webconfig,category:await category}
}
export default Home
