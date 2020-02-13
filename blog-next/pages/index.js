/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-06 22:01:20
 * @LastEditTime : 2020-02-09 22:24:09
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
import {_Api,_Url} from '../config/api'
import Error from './_error'
const pageSize=10
function Home(props){
  if (props.webconfig.status) {
    return <Error statusCode={props.webconfig.status} />
  }
  const {webconfig,category,banner,contentList,rightAd} = props
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
        <TopNav isdown = {isdown} webconfig={webconfig} category={category} contentList={contentList}/>
        <Row  type="flex" justify="center">
          <Col xs={24} sm={24} md={16} lg={15} xl={15}  >
            <Col className="banner-left" span={24}  >
              <Banner banner={banner}/>
            </Col>
            <Col className="comm-left" span={24}  >
              <ArticleList contentList={contentList}/>
            </Col>
          </Col>
          <Col xs={0} sm={0} md={8} lg={5} xl={5}>
                <Advert ad={rightAd}/>
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
Home.getInitialProps = async (content)=>{
  let date=new Date();
  let month=date.getMonth();
  let day=date.getDate();
  let hour=date.getHours();
  let minute=date.getMinutes();
  let second=date.getSeconds();
  let time=month+'/'+day+'/'+hour+':'+minute+':'+second
  console.log('----->'+time+':Visit the Index page')
  const webconfig = await _Api(_Url.webconfigUrl)
  const category = await _Api(_Url.categoryUrl)
  const contentList = await _Api(_Url.contentUrl,{
    page:content.query.page,
    paginate:pageSize,
  })
  const banner = await _Api(_Url.adUrl,{space_id:_Url.blogBanner})
  const rightAd = await _Api(_Url.adUrl,{space_id:_Url.blogRightAd})
  return  {
    webconfig:webconfig.data?webconfig.data:webconfig,
    category:category.data?category.data:[],
    contentList:contentList?contentList:{},
    banner:banner.data?banner.data:[],
    rightAd:rightAd.data?rightAd.data:[],
  }
}
export default Home
