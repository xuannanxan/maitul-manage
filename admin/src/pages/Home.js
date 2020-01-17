/*
 * @Description: 工作台首页
 * @Author: Xuannan
 * @Date: 2019-12-13 23:33:09
 * @LastEditTime : 2020-01-17 14:00:17
 * @LastEditors  : Xuannan
 */


import React,{useState,useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Icon ,Col,Row } from 'antd';
import '../static/css/home.css'
import {Route ,Link ,Switch} from 'react-router-dom'
import AddContent from './content/Add'
import MenuList from './menu/List'
import RuleList from './rule/List'
import RoleList from './role/List'
import AdminList from './admin/List'
import CurrentUser from './admin/CurrentUser'
import AdSpaceList from './adSpace/List'
import AdList from './ad/List'
import {_menuTree} from '../utils/api'
import { CSSTransition,TransitionGroup } from 'react-transition-group'
import {getAllParent,getNode} from '../utils/treeNodes'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const RouteList = [
  {path:"/",component:MenuList},
  {path:"/menu/",component:MenuList},
  {path:"/rule/",component:RuleList},
  {path:"/role/",component:RoleList},
  {path:"/admin/",component:AdminList},
  {path:"/adspace",component:AdSpaceList},
  {path:"/ad",component:AdList},
  {path:"/blog/add",component:AddContent},
]


function Home(props){
    const [collapsed,setCollapsed] = useState(false)
    const [headerMenu,setHeaderMenu] = useState([])
    const [leftMenu,setLeftMenu] = useState([])
    const [activeMenu,setActiveMenu] = useState([])
    const [openMenu,setOpenMenu] = useState([])
    const [activeTopMenu,setActiveTopMenu] = useState([])
    const location = props.location
    
    const getMenuTree = ()=>{
      _menuTree().then(res=>{
        setHeaderMenu(res.data.data)
        let activeNode = getNode(res.data.data,location.pathname,'url')
        let allParents = getAllParent(activeNode,res.data.data)
        if(activeNode){
          //当前URL对应的菜单
          setActiveMenu([activeNode.id])
        }
        if(allParents){
          //展开的菜单
          setOpenMenu(allParents.map((item,index)=>{
            return item.id
          }))
          //选中的顶级菜单
          let topMenuId = ''
          allParents.forEach((item,index)=>{
            if(item.pid==='0'){
              topMenuId = item.id
            }
          })
          let topMenuIndex = []
          res.data.data.forEach((item,index)=>{
            if(item.id===topMenuId){
              topMenuIndex = [String(index)]
              setLeftMenu(item.children)
            }
          })
          setActiveTopMenu(topMenuIndex)
        }
      })
    }
    const getChildMenu = (e)=>{
      setLeftMenu(headerMenu[e.key].children)
      setActiveTopMenu([e.key])
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
    const openSubMenu = (e)=>{
      if(openMenu[0]===e.key){
        setOpenMenu([])
      }else{
        setOpenMenu([e.key])
      }
    }
    const  recursion = (dataSource)=> {
      return (
        dataSource.map((menu, index) => {
          if (menu.children.length) {
            return (
              <SubMenu key={menu.id} onTitleClick={openSubMenu} title={<span>
                <Icon type={menu.icon} />
                <span>{menu.name}</span>
              </span>}>
              {recursion(menu.children)}
              </SubMenu>
            )
          } else {
            return (<Menu.Item key={menu.id} onClick={()=>{setActiveMenu([menu.id])}}><Link to={menu.url}><Icon type={menu.icon} /><span>{menu.name}</span></Link></Menu.Item>)
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
          <Menu mode="inline" selectedKeys={activeMenu} openKeys={openMenu}>
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
                  style={{ lineHeight: '64px' }}
                  selectedKeys={activeTopMenu}
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
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  classNames="router"
                  timeout={300}
                >
                  <Switch location={location}>   
                    {
                        RouteList.map((item,index)=>{
                            return (
                              <Route key={index+item.component} path={item.path} exact  component={item.component} />
                            )
                        })
                    }
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Maitul.com</Footer>
        </Layout>
      </Layout>
    )
}

export default Home