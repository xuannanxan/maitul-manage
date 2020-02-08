/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime : 2020-02-08 15:02:35
 * @LastEditors  : Xuannan
 */
import React,{useState,useEffect} from 'react'
import { Affix,Row,Col,Icon ,List,Button,Skeleton} from 'antd'
import TopNav from '../components/TopNav'
import Header from '../components/Header'
import Api from '../config/api'
import {_contentList} from '../config/api'
import axios from 'axios'
import Author from '../components/Author'
import Error from './_error'

let pageSize = 10
const Detail = (props) => {
  if (props.webconfig.status) {
    return <Error statusCode={props.status} />
  }
  const webconfig = props.webconfig?props.webconfig:{}
  const category = props.category?props.category:[]
  const [ loading , setLoading ] = useState(false)
  const [ initLoading , setInitLoading ] = useState(false)
  const [ isdown , setIsdown ] = useState(false)
  const [ content , setContent ] = useState(props.content?props.content:{})
  const [contentList,setContentList] = useState([])
  const [currentPage,setCurrentPage] = useState(1)
  const [total,setTotal] = useState(1)
  const [categoryId,setCategoryId] = useState(props.content.category_id?props.content.category_id:'')

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
  const  onLoadMore = () => {
    setInitLoading(true)
    if(total/pageSize>currentPage){
      setCurrentPage(currentPage+1)
      setContentList(contentList.concat([...new Array(pageSize)].map(() => ({ loading: true, name: {} }))))
      _contentList({page:currentPage+1,paginate:pageSize}).then(res=>{
        setContentList(contentList.concat(res.data.data))
        setTotal(res.data.paginate.total)
        setInitLoading(false)
      })
    }
    setTimeout(() => {
      setInitLoading(false)
    }, 500);
  };
  const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          {total/pageSize>currentPage?
          <Button onClick={onLoadMore}>More</Button>
          :(contentList&&contentList.length?'只有这么多了...':'')}
        </div>
      ) : null;
  const showContent=(item)=>{
    setLoading(true)
    _contentList({id:item.id}).then(res=>{
      setContent(res.data.data)
      setLoading(false)
    })
    setCategoryId(item.category_id)
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }
  //监听滚动动作
  useEffect(() => {
    setLoading(true)
    _contentList({paginate:pageSize}).then(res=>{
      setContentList(res.data.data)
      setTotal(res.data.paginate.total)
      setLoading(false)
    })
    setTimeout(() => {
      setLoading(false)
    }, 500);
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
                  loading={initLoading}
                  loadMore={loadMore}
                  size="small"
                  header={<div>最新推荐</div>}
                  itemLayout="vertical"
                  dataSource={contentList}
                  renderItem={item => (
                    <Skeleton title={false} loading={item.loading} active>
                    <List.Item>
                      <div className='right-list' title={item.title} >
                          <a className={item.id===content.id?'active':'' } onClick = {()=>{showContent(item)}}>{item.title}</a>
                      </div>
                    </List.Item>
                    </Skeleton> 
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
