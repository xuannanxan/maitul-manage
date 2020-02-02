/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime : 2020-02-02 22:41:15
 * @LastEditors  : Xuannan
 */
import React ,{useState,useEffect}from 'react'
import Head from 'next/head'
import { Row,Col ,BackTop} from 'antd'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Advert from '../components/Advert'
import ArticleList from '../components/ArticleList'
import User from '../components/User'
import Footer from '../components/Footer'
import {_webconfig} from '../utils/api'
function Home(){
  const [webconfig,setWebconfig] = useState({})
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
    _webconfig().then(res=>{
      setWebconfig(res.data.data)
    })
    document.addEventListener('scroll', onScroll, false);
    return () => {
      document.removeEventListener('scroll', onScroll, false);
    };

  }, []);

  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
        <div className="comm-main">
          <Header isdown = {isdown} webconfig={webconfig}/>
          <Row  type="flex" justify="center">
            <Col className="banner-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
              <Banner/>
            </Col>
            <Col xs={0} sm={0} md={7} lg={5} xl={5}>
              <Advert/>
            </Col>
            <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
              <ArticleList/>
            </Col>
  
            <Col xs={0} sm={0} md={7} lg={5} xl={5}>
              <User/>
            </Col>
          </Row>
        </div>
        <Footer/>
        <BackTop />   
    </div>
  )
}

export default Home
