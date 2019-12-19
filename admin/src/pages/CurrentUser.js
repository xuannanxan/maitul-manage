/*
 * @Description: 当前用户，包含用户资料修改，密码修改等功能
 * @Author: Xuannan
 * @Date: 2019-12-19 17:06:47
 * @LastEditTime : 2019-12-19 17:09:44
 * @LastEditors  : Xuannan
 */
import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        修改资料
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        修改密码
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        退出
      </a>
    </Menu.Item>
  </Menu>
);


function CurrentUser(){

    return (
        <div>
            <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
            Hover me <Icon type="down" />
            </a>
            </Dropdown>


        </div>
    )
}

export default CurrentUser