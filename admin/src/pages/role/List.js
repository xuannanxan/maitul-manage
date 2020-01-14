/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-01-14 16:33:22
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_menuTree,_ruleList,_roleList,_roleDelete} from '../../utils/api'
import {Table ,Divider ,Icon  ,Button ,Modal,message,Spin} from 'antd';
import RoleForm from './Form'
import AuthForm from './Auth'
const { confirm } = Modal;


const RoleList = ()=>{
    const [roleList,setRoleList] = useState([])
    const [menuTree,setMenuTree] = useState([])
    const [ruleList,setRuleList] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [title,setTitle] = useState('新增角色')
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [formData,setFormData] = useState({})
    const formRef = useRef();
    //授权的相关数据
    const [authTitle,setAuthTitle] = useState('角色授权')
    const [authVisible,setAuthVisible] = useState(false)
    const [confirmAuthLoading,setConfirmAuthLoading] = useState(false)
    const authRef = useRef();
    

    // 获取菜单树
    const getMenuTree = ()=>{
        _menuTree().then(res=>{
            setMenuTree(res.data.data)
        })
    }
    //获取权限规则列表
    const getRuleList = ()=>{
        _ruleList().then(res=>{
            setRuleList(res.data.data)
        })
    }
    
    // 获取角色列表
    const getRoleList = ()=>{
        setIsLoading(true)
        _roleList().then(res=>{
            setRoleList(res.data.data)
        })
        setTimeout(()=>{
            setIsLoading(false)
        },500)
    }
    //删除角色
    const deleteData = (id)=>{
    confirm({
        title: '删除确认?',
        content: '删除后无法恢复，请谨慎操作！！',
        onOk() {
        _roleDelete(id).then(res=>{
            if(res.data.status===200){
            message.success(res.data.msg)
            getRoleList()
            }
        })
        },
        onCancel() {
        //console.log('Cancel');
        },
    }); 
    }

    const showModal=(record)=>{
        if(record.id){
            setFormData(record)
            setTitle('修改角色【'+record.name+'】')
        }else{
            setFormData({})
            setTitle('新增角色')
        }
        setTimeout(()=>{
          formRef.current.init()
        },300)
        setVisible(true)
      }

    const handleCancel = ()=>{
        setVisible(false)
    }
    const handleOk = ()=>{
        setConfirmLoading(true)
        formRef.current.submitFormData()
        setTimeout(()=>{
        setConfirmLoading(false)
        },300)
    }
    // 授权的modal
    const showAuthModal=(record)=>{
        setFormData(record)
        setAuthTitle('角色授权【'+record.name+'】')
        setTimeout(()=>{
            authRef.current.init()
          },300)
        setAuthVisible(true)
    }
    const handleAuthCancel = ()=>{
        setAuthVisible(false)
    }
    const handleAuthOk = ()=>{
        setConfirmAuthLoading(true)
        authRef.current.submitFormData()
        setTimeout(()=>{
        setConfirmAuthLoading(false)
        },300)
    }


    useEffect(()=>{
        getRoleList()
        getMenuTree()
        getRuleList()
    },[])
    const columns = [
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '描述',
          dataIndex: 'info',
          key: 'info',
        },
        {
          title: '最后修改人',
          dataIndex: 'last_editor',
          key: 'last_editor',
        },
        {
            title: '最后修改时间',
            dataIndex: 'update_time',
            key: 'update_time',
          },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button type="link" size='small'  onClick={() => showAuthModal(record)}><Icon type="key" />授权</Button>
                <Divider type="vertical" />
                <Button type="link" size='small'  onClick={() => showModal(record)}><Icon type="edit" />修改</Button>
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
            {roleList && roleList.length? 
            <Table rowKey="id" 
            dataSource={roleList} 
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
            <RoleForm cRef={formRef} params={formData} handleCancel={handleCancel} refresh = {getRoleList}/>
            </Modal>
            <Modal
            width={800}
            title={authTitle}
            visible={authVisible}
            onOk={handleAuthOk}
            confirmLoading={confirmAuthLoading}
            onCancel={handleAuthCancel}
            >
            <AuthForm cRef={authRef} params={{menu:menuTree,rule:ruleList,id:formData.id}} handleCancel={handleAuthCancel}/>
            </Modal>
        </div>
    )
}

export default RoleList