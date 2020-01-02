/*
 * @Description: 工作台首页
 * @Author: Xuannan
 * @Date: 2019-12-13 23:33:09
 * @LastEditTime : 2020-01-02 10:58:08
 * @LastEditors  : Xuannan
 */


import React,{useState,useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Icon ,Col,Row } from 'antd';
import '../static/css/home.css'
import {Route,Link} from 'react-router-dom'
import AddContent from './content/Add'
import MenuList from './menu/List'
import CurrentUser from './CurrentUser'
import {_menuTree} from '../utils/api'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Home(){
    const [collapsed,setCollapsed] = useState(false)
    const [headerMenu,setHeaderMenu] = useState([])
    const [leftMenu,setLeftMenu] = useState([])
    
    const getMenuTree = ()=>{
      _menuTree().then(res=>{
        setHeaderMenu(res.data.data)
      })
    }
    const getChildMenu = (e)=>{
      setLeftMenu(headerMenu[e.key].children)
    }
    const headerMenuItem = ()=>{
      return (
        headerMenu.map((menu, index) => {
          return (<Menu.Item key={index}><Icon type={menu.icon} />{menu.name}</Menu.Item>)
        })
      )
    }
    const leftMenuItem = ()=>{
        if(leftMenu){
          return recursion(leftMenu) 
        }
    }
    const  recursion = (dataSource)=> {
      return (
        dataSource.map((menu, index) => {
          if (menu.children.length>0) {
            return (
              <SubMenu key={menu.id} title={<span>
                <Icon type={menu.icon} />
                <span>{menu.name}</span>
              </span>}>
              {recursion(menu.children)}
              </SubMenu>
            )
          } else {
            return (<Menu.Item key={menu.id}><Link to={menu.url}><Icon type={menu.icon} />{menu.name}</Link></Menu.Item>)
          }
        })
      )
    }    
    const onCollapse = collapsed => {
      setCollapsed(collapsed)
    };
    useEffect(()=>{
      getMenuTree()
    },[])
    return(
        <Layout style={{ minHeight: '100vh' }}>
        <Sider  collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ background: '#fff' }}>
          <div className="logo">Maitul Manage</div>
          <Menu defaultSelectedKeys={['1']} mode="inline">
            {leftMenuItem()}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#001529', padding: 0 }} >
              <Row>
                <Col span={20}>
                  <Menu
                  onClick = {getChildMenu}
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={['0']}
                  style={{ lineHeight: '64px' }}
                  >
                      {headerMenuItem()}
                  </Menu>
                </Col>
                <Col span={4}>
                  <CurrentUser/>
                </Col>
              </Row>
            
            
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>后台管理</Breadcrumb.Item>
              <Breadcrumb.Item>工作台</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Route path="/" exact  component={MenuList}/>
              <Route path="/menu/" exact  component={MenuList}/>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Maitul.com</Footer>
        </Layout>
      </Layout>
    )
}

export default Home