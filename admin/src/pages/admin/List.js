/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-01-14 22:17:31
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_adminList,_roleList,_adminDelete} from '../../utils/api'
import {Table ,Divider ,Icon  ,Button ,Modal,message,Spin} from 'antd';
//import RoleForm from './Form'
//import AuthForm from './Auth'
const { confirm } = Modal;


const AdminList = ()=>{
    const [roleList,setRoleList] = useState([])
    const [adminList,setAdminList] = useState([])
   
    const [isLoading,setIsLoading] = useState(false)
    const [title,setTitle] = useState('新增管理员')
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [formData,setFormData] = useState({})
    const formRef = useRef();


    // 获取管理员列表
    const getAdminList = ()=>{
        setIsLoading(true)
        _adminList().then(res=>{
            setAdminList(res.data.data)
        })
        setTimeout(()=>{
            setIsLoading(false)
        },500)
    }

    // 获取角色列表
    const getRoleList = ()=>{ 
        _roleList().then(res=>{
            setRoleList(res.data.data)
        })
    }
    //删除管理员
    const deleteData = (id)=>{
        confirm({
            title: '删除确认?',
            content: '删除后无法恢复，请谨慎操作！！',
            onOk() {
            _adminDelete(id).then(res=>{
                if(res.data.status===200){
                message.success(res.data.msg)
                getAdminList()
                }
            })
            },
            onCancel() {
            //console.log('Cancel');
            },
        }); 
    }

    const showModal=(record)=>{
        
        setVisible(true)
      }

    const handleCancel = ()=>{
        setVisible(false)
    }
    const handleOk = ()=>{
        setConfirmLoading(true)
        //formRef.current.submitFormData()
        setTimeout(()=>{
        setConfirmLoading(false)
        },300)
    }
    
    useEffect(()=>{
        getRoleList()
        getAdminList()
    },[])
    const columns = [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '角色',
            dataIndex: 'roles_name',
            key: 'roles_name',
        },
        {
            title: '最后登录时间',
            dataIndex: 'last_login',
            key: 'last_login',
        },
        {
            title: '最后登录IP',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button type="link" size='small'  onClick={() => showModal(record)}><Icon type="team" />角色</Button>
                <Divider type="vertical" />
                <Button type="link" size='small'  onClick={() => showModal(record)}><Icon type="reload" />重置密码</Button>
                <Divider type="vertical" />
                <Button type="link" size='small'  onClick={() => deleteData(record.id)}><Icon type="delete" />删除</Button>
              </span>
            ),
        },
    ];  
    return (
        <div className='main-content'>
            <Button type="primary" onClick={showModal} size="large"><Icon type="plus"/> 添加</Button>
            <br /><br />
            <Spin tip="Loading..." spinning={isLoading}>
            {adminList && adminList.length? 
            <Table rowKey="id" 
            dataSource={adminList} 
            columns={columns} 
            pagination={false} 
            defaultExpandAllRows={true}/>
                : '暂无数据' }
            </Spin>
            <Modal
            width={600}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
           
            </Modal>
            
        </div>
    )
}

export default AdminList