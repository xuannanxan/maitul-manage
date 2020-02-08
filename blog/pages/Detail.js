/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime : 2020-02-08 22:19:37
 * @LastEditors  : Xuannan
 */
import React,{useState,useEffect} from 'react'
import { Affix,Row,Col,Icon ,List,Button,Skeleton} from 'antd'
import TopNav from '../components/TopNav'
import Header from '../components/Header'
import {_Api,_Url} from '../config/api'
import Author from '../components/Author'
import Error from './_error'
import Link from 'next/link'

const Detail = (props) => {
  if (props.webconfig.status) {
    return <Error statusCode={props.status} />
  }
  const {webconfig,category,content} = props
  const contentList=props.contentList.data?props.contentList.data:[]
  const [ loading , setLoading ] = useState(true)
  const [ isdown , setIsdown ] = useState(false)
  const categoryId = content.category_id?content.category_id:''
  
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
    setLoading(false)
    document.addEventListener('scroll', onScroll, false);
    return () => {
      document.removeEventListener('scroll', onScroll, false);
    };
  }, []);
  return(
    <div>
      <Header  webconfig={webconfig} content={content}/>
      <div>
        <TopNav isdown = {isdown} webconfig={webconfig} categoryId={categoryId} category={category} contentList={props.contentList}/>
        <Row className="comm-main" type="flex" justify="center">
          <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
          <div>
            <Skeleton loading={loading} active>
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
            </Skeleton> 
          </div>
          </Col>
          <Col xs={0} sm={0} md={7} lg={5} xl={5}>
            <Author webconfig={webconfig}/>
            <Affix offsetTop={60}>
              <div className="comm-right" >
                <List
                  loading={loading}
                  size="small"
                  header={<div>最新推荐</div>}
                  itemLayout="vertical"
                  dataSource={contentList}
                  renderItem={item => (
                    <List.Item>
                      <Link href={{pathname:'/detail',query:{id:item.id}}} passHref>
                        <div className='right-list' title={item.title} >
                            <a className={item.id===content.id?'active':'' }>{item.title}</a>
                        </div>
                      </Link>
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
  console.log('----->'+time+':Visit the detail page -' + content.query.id)
  const webconfig = await _Api(_Url.webconfigUrl)
  const category = await _Api(_Url.categoryUrl)
  const contentData = await _Api(_Url.contentUrl,{
    id:content.query.id,
  })
  const contentList = await _Api(_Url.contentUrl,{
    page:1,
    paginate:15,
  })
  return  {
    webconfig:webconfig.data?webconfig.data:webconfig,
    category:category.data?category.data:[],
    content:contentData.data?contentData.data:{},
    contentList:contentList?contentList:{},
  }
}
export default Detail
