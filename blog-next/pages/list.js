/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 00:18:02
 * @LastEditTime : 2020-02-11 14:01:18
 * @LastEditors  : Xuannan
 */

import React,{useState,useEffect} from 'react'
import { Affix,Row,Col } from 'antd'
import TopNav from '../components/TopNav'
import Header from '../components/Header'
import {_Api,_Url} from '../config/api'
import Advert from '../components/Advert'
import ArticleList from '../components/ArticleList'
import Author from '../components/Author'
import Error from './_error'
const pageSize=10
const List = (props) => {
  if (props.webconfig.status) {
    return <Error statusCode={props.webconfig.status} />
  }
  const {webconfig,category,contentList,rightAd,categoryId,search,tag} = props
  const [ isdown , setIsdown ] = useState(false)
  const getCurrenCategory = ()=>{
    for (var i =0; i<category.length; i++) {
      if(category[i].id === categoryId){
        return category[i]
     }
    }
  }
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
  return(
    <div>
      <Header  webconfig={webconfig} currentCategory={getCurrenCategory()}/>
      <div>
        <TopNav isdown = {isdown} webconfig={webconfig} categoryId={categoryId} category={category} contentList={contentList}/>
        <Row className="comm-main" type="flex" justify="center">
          <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
            <ArticleList contentList={contentList} categoryId={categoryId} search={search} tag={tag} currentCategory={getCurrenCategory()}/>
          </Col>

          <Col xs={0} sm={0} md={7} lg={5} xl={5}>
            <Affix offsetTop={60}>
              <div>
                <Author webconfig={webconfig}/>
                <Advert ad={rightAd}/>
              </div>
            </Affix>
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
  console.log('----->'+time+':Visit the list page-'+ content.query.id)
  const webconfig = await _Api(_Url.webconfigUrl)
  const category = await _Api(_Url.categoryUrl)
  const contentList = await _Api(_Url.contentUrl,{
    page:content.query.page,
    paginate:pageSize,
    search:content.query.search,
    category_id:content.query.id,
    tag:content.query.tag,
  })
  const rightAd = await _Api(_Url.adUrl,{space_id:_Url.blogRightAd})
  return  {
    webconfig:webconfig.data?webconfig.data:webconfig,
    category:category.data?category.data:[],
    contentList:contentList?contentList:{},
    rightAd:rightAd.data?rightAd.data:[],
    categoryId:content.query.id?content.query.id:'',
    search:content.query.search?content.query.search:'',
    tag:content.query.tag?content.query.tag:'',
  }
}
export default List
