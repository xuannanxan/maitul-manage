/*
 * @Description: 当前用户，包含用户资料修改，密码修改等功能
 * @Author: Xuannan
 * @Date: 2019-12-19 17:06:47
 * @LastEditTime : 2020-01-10 15:50:08
 * @LastEditors  : Xuannan
 */
import React,{useState,useEffect,useRef} from 'react';
import { Menu, Dropdown, Icon ,Modal,Button} from 'antd';
import {_currentUser,_logout} from '../utils/api'
import ChangeUserInfo from './admin/ChangeInfo'
import ChangeUserPwd from './admin/ChangePwd'

function CurrentUser(){
    const [user,setUser] = useState({})
    const [visible,setVisible] = useState(false)
    const [title,setTitle] = useState('')
    const [op,setOp] = useState('')
    const [confirmLoading,setConfirmLoading] = useState(false)
    const userInfoRef = useRef()
    const userPwdRef = useRef();
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
      setConfirmLoading(true)
      if(op==='password'){
        userPwdRef.current.changeUserPwd()
      }else{
        userInfoRef.current.changeUserInfo()
      }
      setConfirmLoading(false)  
    }
    const showModal = (option)=>{   
      setOp(option)  
      if(option==='password'){
        setTitle('修改密码')
      }else{
        setTitle('修改个人信息')
        setTimeout(()=>{
          userInfoRef.current.init()
        },300)
      }
      setVisible(true)
    }
    useEffect(()=>{
      getCurrentUser()
    },[])
    const infoForm = (
      <ChangeUserInfo cRef = {userInfoRef} params={user} handleCancel={handleCancel} refreshUser = {getCurrentUser}/>
    )
    const pwdForm = (
      <ChangeUserPwd cRef = {userPwdRef} handleCancel={handleCancel} refreshUser = {getCurrentUser}/>
    )
    const menu = (
      <Menu>
        <Menu.Item>
          <Button type="link" size='small' className='link-btn'  target="_blank" rel="noopener noreferrer" onClick={()=>showModal('')}>
            修改资料
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button type="link" size='small' className='link-btn' target="_blank" rel="noopener noreferrer" onClick={()=>showModal('password')}>
            修改密码
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button type="link" size='small' className='link-btn'  target="_blank" rel="noopener noreferrer" onClick={()=>logout()}>
            退出
          </Button>
        </Menu.Item>
      </Menu>
    );
    
    return (
        <div>
            <Dropdown overlay={menu}>
              <Button type="link" className="ant-dropdown-link">{user.name} <Icon type="down" /></Button>
            </Dropdown>
            <Modal
            width={600}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
              {op?pwdForm:infoForm}
              
            </Modal>

        </div>
    )
}

export default CurrentUser