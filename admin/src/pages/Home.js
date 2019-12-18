/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-13 23:33:09
 * @LastEditTime : 2019-12-18 22:20:55
 * @LastEditors  : Xuannan
 */


import React,{useState} from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import '../static/css/home.css'
import {Route} from 'react-router-dom'
import AddContent from './Content/Add'


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Home(){
    const [collapsed,setCollapsed] = useState(false)

    const onCollapse = collapsed => {
      setCollapsed(collapsed)
    };


 

    return(
        <Layout style={{ minHeight: '100vh' }}>
        <Sider  collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ background: '#fff' }}>
          <div className="logo">Maitul Manage</div>
          <Menu defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>工作台</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>添加文章</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>文章管理</span>
                </span>
              }
            >
              <Menu.Item key="3">添加文章</Menu.Item>
              <Menu.Item key="4">文章列表</Menu.Item>

            </SubMenu>

            <Menu.Item key="9">
              <Icon type="file" />
              <span>留言管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
            <Header style={{ background: '#fff', padding: 0 }} >
            <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
            >
                <Menu.Item key="1">nav 1</Menu.Item>
                <Menu.Item key="2">nav 2</Menu.Item>
                <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>后台管理</Breadcrumb.Item>
              <Breadcrumb.Item>工作台</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <div><Route path="/home/" exact  component={AddContent} /></div>

            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Maitul.com</Footer>
        </Layout>
      </Layout>
    )
}

export default Home