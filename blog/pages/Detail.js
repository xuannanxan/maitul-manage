/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime : 2020-02-07 21:53:02
 * @LastEditors  : Xuannan
 */
import React,{useState,useEffect} from 'react'
import { Affix,Row,Col,Icon ,List} from 'antd'
import TopNav from '../components/TopNav'
import Header from '../components/Header'
import Api from '../config/api'
import {_contentList} from '../config/api'
import axios from 'axios'
import Author from '../components/Author'
import Error from './_error'
import Link from 'next/link'
import '../public/style/pages/detail.less'
let pageSize = 10
const Detail = (props) => {
  if (props.webconfig.status) {
    return <Error statusCode={props.status} />
  }
  console.log(props)
  const webconfig = props.webconfig?props.webconfig:{}
  const category = props.category?props.category:[]

  const [ isdown , setIsdown ] = useState(false)
  const [ content , setContent ] = useState(props.content?props.content:{})
  const [contentList,setContentList] = useState([])
  const [currentPage,setCurrentPage] = useState(1)
  const [total,setTotal] = useState(1)
  const [categoryId,setCategoryId] = useState(props.content.category_id?props.content.category_id:'')
//获取内容列表
const getContentList = (cateId = categoryId,page = currentPage)=>{
  _contentList({category_id:cateId,page:page,paginate:pageSize}).then(res=>{
    setContentList(res.data.data)
    setTotal(res.data.paginate.total)
  })
  .catch(error=>{
    setContentList([])
  })
  //如果分类不是当前选中的，就重新设置选中分类
  if(cateId !== categoryId){
    setCategoryId(cateId)
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
  getContentList(categoryId,1)
  document.addEventListener('scroll', onScroll, false);
    return () => {
      document.removeEventListener('scroll', onScroll, false);
    };
  }, []);
  return(
    <div>
      <Header  webconfig={webconfig} content={content}/>
      <div>
        <TopNav isdown = {isdown} webconfig={webconfig} categoryId={categoryId} category={category} />
        <Row className="comm-main" type="flex" justify="center">
          <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
          <div>
            <div className="detail-title">
            {content.title?content.title:'.....'}
            </div>

            <div className="list-icon center">
              <span><Icon type="calendar" /> {content.create_time?content.create_time:'.....'}</span>
              <span><Icon type={content.category_icon?content.category_icon:"folder"} /> {content.category_name?content.category_name:'.....'}</span>
              <span><Icon type="fire" /> {content.click?content.click:'0'}人</span>
            </div>
            <div className="detail-content" dangerouslySetInnerHTML={{__html: content.content?content.content:'...'}}>
            </div>
          </div>
          </Col>

          <Col xs={0} sm={0} md={7} lg={5} xl={5}>
            <Author webconfig={webconfig}/>
            <Affix offsetTop={60}>
              <div className="comm-right" >
                <List
                  size="small"
                  header={<div>相关推荐</div>}
                  itemLayout="vertical"
                  dataSource={contentList}
                  renderItem={item => (
                    <List.Item>
                      <div>
                          <a onClick = {()=>{setContent(item)}}>{item.title}</a>
                      </div>
                      
                    </List.Item>
                  )}
                />   
              </div>
            
            </Affix>
          </Col>
        </Row>
      </div>
    </div>
  ) 
}
Detail.getInitialProps = async (content)=>{
  let date=new Date();
  let month=date.getMonth();
  let day=date.getDate();
  let hour=date.getHours();
  let minute=date.getMinutes();
  let second=date.getSeconds();
  let time=month+'/'+day+'/'+hour+':'+minute+':'+second
  console.log('----->'+time+':Visit the detail page-'+content.query.id)
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
  const contentData = new Promise(resolve=>{
    axios({url:Api.contentUrl,method:'GET',params:{id:content.query.id,site:Api.site.site}}).then(res=>{
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
    content:await contentData,
  }
}
export default Detail
