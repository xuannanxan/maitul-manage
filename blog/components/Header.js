/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:52:00
 * @LastEditTime: 2019-12-06 16:26:45
 * @LastEditors: Xuannan
 */
import React from 'react';
import '../static/style/components/header.less'
import { Row,Col,Menu,Icon } from 'antd';

const Header = ()=>{


    return (
        <div className="header">
            <Row type='flex' justify='center'>
                <Col  xs={24} sm={24} md={10} lg={15} xl={15}>
                    <span className="header-logo">Allen</span>
                    <span className="header-txt">全栈PM</span>
                </Col>
                <Col className="memu-div" xs={0} sm={0} md={14} lg={8} xl={6}>
                    <Menu  mode="horizontal">
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

            </Row>

        </div>
    )
}

export default Header