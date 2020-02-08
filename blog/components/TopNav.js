/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-06 22:01:20
 * @LastEditTime : 2020-02-08 22:07:02
 * @LastEditors  : Xuannan
 */


import React ,{ useState } from 'react';
import { Row,Col,Menu,Icon, Input ,Button,Drawer,List,Divider} from 'antd';
import Router from 'next/router'
import Link from 'next/link'

const { Search } = Input;


function TopNav(props){
    const {isdown,webconfig,categoryId,category} = props
    const [ visible , setVisible ] = useState(false);
    const contentList=props.contentList.data?props.contentList.data:[]
    const handleClick = (e)=>{
        if(e.key=='home'){
            Router.push('/index')
        }else{
            Router.push('/list?id='+e.key) 
        }
    }
    return (
        <div className ={isdown?'header isdown':'header'} >
            <Row type='flex' justify='center'>
                <Col  xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Link href={{pathname:'/index'}} passHref>
                        <div className="header-logo">{webconfig.blogName?webconfig.blogName:"Allen's Blog"}</div>
                    </Link>
                    <div className="header-txt">{webconfig.blogSlogan?webconfig.blogSlogan:'Welcome to my blog.'}</div> 
                </Col>
                <Col className="header-menu" xs={0} sm={0} md={9} lg={9} xl={9}>
                    <Menu  
                    mode="horizontal" 
                    className="f-right" 
                    onClick={handleClick}
                    selectedKeys={categoryId?categoryId:'home'}
                    >
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
                        onSearch={value => Router.push('/list?'+(categoryId?'id='+categoryId:'')+'&search='+value)}
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
                    title="快速导航"
                    placement="right"
                    closable={false}
                    onClose={()=>{setVisible(false)}}
                    visible={visible}
                    closable={true}
                    >
                        <List
                        size="small"
                        header={<h2>Menu</h2>}
                        itemLayout="vertical"
                        dataSource={category}
                        renderItem={item => (
                            <List.Item>
                            <Link href={{pathname:'/list',query:{id:item.id}}} passHref>
                                <div className='right-list' title={item.name} >
                                    <a className={item.id===categoryId?'active':'' }>{item.name}</a>
                                </div>
                            </Link>
                            </List.Item>
                        )}
                        />  
                        <Divider />
                        <List
                        size="small"
                        header={<div>最新推荐</div>}
                        itemLayout="vertical"
                        dataSource={contentList}
                        renderItem={item => (
                            <List.Item>
                            <Link href={{pathname:'/detail',query:{id:item.id}}} passHref>
                                <div className='right-list' title={item.title} >
                                    <a >{item.title}</a>
                                </div>
                            </Link>
                            </List.Item>
                        )}
                        />  
                    </Drawer>
                </Col>

            </Row>

        </div>
    )
}

export default TopNav