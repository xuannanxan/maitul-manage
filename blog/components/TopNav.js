/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-06 22:01:20
 * @LastEditTime : 2020-02-06 22:52:13
 * @LastEditors  : Xuannan
 */


import React ,{ useState ,useEffect} from 'react';
import { Row,Col,Menu,Icon, Input ,Button,Drawer} from 'antd';
import '../public/style/components/header.less'
import {_category} from '../config/api'
import Router from 'next/router'
import Link from 'next/link'

const { Search } = Input;


function TopNav(props){
    const {isdown,webconfig} = props
    const [category,setCategory] = useState([]);
    const [ visible , setVisible ] = useState(false);
    const handleClick = (e)=>{
        if(e.key=='home'){
            Router.push('/index')
        }else{
            Router.push('/list?id='+e.key)
        }
    }
    useEffect(()=>{
        _category().then(res=>{
            setCategory(res.data.data)
          })
          .catch(error=>{
            setCategory([])
          })
      },[])
    return (
        <div className ={isdown?'header isdown':'header'} >
            <Row type='flex' justify='center'>
                <Col  xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Link href={{pathname:'/index'}}>
                        <div className="header-logo">{webconfig.blogName?webconfig.blogName:"Allen's Blog"}</div>
                    </Link>
                    <div className="header-txt">{webconfig.blogSlogan?webconfig.blogSlogan:'Welcome to my blog.'}</div> 
                </Col>
                <Col className="header-menu" xs={0} sm={0} md={9} lg={9} xl={9}>
                    <Menu  mode="horizontal" className="f-right" onClick={handleClick}>
                        <Menu.Item key="home">
                            <Icon type="home" />
                            首页
                        </Menu.Item>
                        {category && category.length?
                        category.map(item=>{
                            return(
                                <Menu.Item key={item.id}>
                                    <Icon type={item.icon} />
                                    {item.name}
                                </Menu.Item>
                            )
                        }):''}
                    </Menu>
                </Col>
                <Col xs={0} sm={0} md={8} lg={5} xl={5}>
                    <Search
                        className = "f-right header-search"
                        placeholder="请输入..."
                        onSearch={value => console.log(value)}
                        style={{ width: 200 }}
                    />
                </Col>
                <Col xs={12} sm={12} md={0} lg={0} xl={0}>
                    <Button 
                    type="link" 
                    icon="menu" 
                    className="f-right header-search-btn"
                    onClick={()=>{setVisible(true)}}
                    >
                    </Button>
                    <Drawer
                    title="Basic Drawer"
                    placement="right"
                    closable={false}
                    onClose={()=>{setVisible(false)}}
                    visible={visible}
                    closable={true}
                    >
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Drawer>
                </Col>

            </Row>

        </div>
    )
}

export default TopNav