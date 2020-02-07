/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime : 2020-02-07 21:41:11
 * @LastEditors  : Xuannan
 */
import React,{useState,useEffect} from 'react'
import { Affix,Row,Col } from 'antd'
import TopNav from '../components/TopNav'
import Header from '../components/Header'
import Api from '../config/api'
import axios from 'axios'
import Advert from '../components/Advert'
import ArticleList from '../components/ArticleList'
import Author from '../components/Author'
import Error from './_error'

const List = (props) => {
  if (props.webconfig.status) {
    return <Error statusCode={props.status} />
  }

  const webconfig = props.webconfig?props.webconfig:{}
  const categoryId = props.category_id?props.category_id:''
  const category = props.category?props.category:[]
  const search = props.search?props.search:''
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
        <TopNav isdown = {isdown} webconfig={webconfig} categoryId={categoryId} category={category} />
        <Row className="comm-main" type="flex" justify="center">
          <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
            <ArticleList categoryId={categoryId} search={search} currentCategory={getCurrenCategory()}/>
          </Col>

          <Col xs={0} sm={0} md={7} lg={5} xl={5}>
            <Affix offsetTop={60}>
              <div>
                <Author webconfig={webconfig}/>
                <Advert />
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
  console.log('----->'+time+':Visit the List page-'+content.query.id)
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
  return  {
    webconfig:await webconfig,
    category:await category,
    category_id:content.query.id,
    search:content.query.search
  }
}
export default List
