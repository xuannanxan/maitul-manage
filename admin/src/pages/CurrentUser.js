/*
 * @Description: 当前用户，包含用户资料修改，密码修改等功能
 * @Author: Xuannan
 * @Date: 2019-12-19 17:06:47
 * @LastEditTime : 2020-01-02 17:29:50
 * @LastEditors  : Xuannan
 */
import React,{useState,useEffect} from 'react';
import { Menu, Dropdown, Icon ,Modal} from 'antd';
import {_currentUser,_logout} from '../utils/api'


function CurrentUser(){
    const [user,setUser] = useState({})
    const [visible,setVisible] = useState(false)
    const [title,setTitle] = useState('')
    const [confirmLoading,setConfirmLoading] = useState(false)
    const getCurrentUser = ()=>{
      _currentUser().then(res=>{
        setUser(res.data.data)
      })
    }
    const logout=()=>{
      _logout()
    }
    const handleCancel = ()=>{
      setVisible(false)
    }
    const handleOk = ()=>{
      setVisible(false)
        
    }
    const showModal = (op)=>{
      setVisible(true)
      if(op==='password'){
        setTitle('修改密码')
      }else{
        setTitle('修改个人信息')
      }
    }
    useEffect(()=>{
      getCurrentUser()
    },[])
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={()=>showModal()}>
            修改资料
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={()=>showModal('password')}>
            修改密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={()=>logout()}>
            退出
          </a>
        </Menu.Item>
      </Menu>
    );
    
    return (
        <div>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
              {user.name} <Icon type="down" />
              </a>
            </Dropdown>
            <Modal
            width={600}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>

        </div>
    )
}

export default CurrentUser