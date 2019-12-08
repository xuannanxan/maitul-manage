/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-06 22:01:20
 * @LastEditTime: 2019-12-07 16:12:40
 * @LastEditors: Xuannan
 */
/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:52:00
 * @LastEditTime: 2019-12-07 15:54:42
 * @LastEditors: Xuannan
 */
import React ,{ useState } from 'react';
import { Row,Col,Menu,Icon, Input ,Button,Drawer} from 'antd';
import '../static/style/components/header.less'

const { Search } = Input;


function Header(props){
    const [ visible , setVisible ] = useState(false);
    return (
        <div className ={props.isdown?'header isdown':'header'} >
            <Row type='flex' justify='center'>
                <Col  xs={12} sm={12} md={6} lg={6} xl={6}>
                    <div className="header-logo">全栈PM</div>
                    <div className="header-txt">我的全栈产品经理之路</div> 
                </Col>
                <Col className="header-menu" xs={0} sm={0} md={9} lg={9} xl={9}>
                    <Menu  mode="horizontal" className="f-right">
                        <Menu.Item key="home">
                            <Icon type="home" />
                            首页
                        </Menu.Item>
                        <Menu.Item key="video">
                            <Icon type="youtube" />
                            视频
                        </Menu.Item>
                        <Menu.Item key="life">
                            <Icon type="smile" />
                            生活
                        </Menu.Item>
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

export default Header