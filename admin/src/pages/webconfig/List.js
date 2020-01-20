/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-01-20 17:29:52
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_menuTree,_configList,_configDelete} from '../../utils/api'
import {Table ,Divider ,Icon ,Menu ,Button ,Modal,message,Col,Row,Spin} from 'antd';
import ConfForm from './Form'

const { confirm } = Modal;
const ConfList = ()=>{
    const [isLoading,setIsLoading] = useState(false)
    const [menuTree,setMenuTree] = useState([])
    const [confList,setConfList] = useState([])
    const [menuId,setMenuId] = useState('')
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增权限规则')
    const [formData,setFormData] = useState({})
    const formRef = useRef();

    const getMenuTree = ()=>{
      _menuTree().then(res=>{
          setMenuTree(res.data.data)
      })
    }
    //获取权限规则列表
    const getConfigList = ()=>{
      console.log(menuId)
      if (menuId){
        _configList({moduleID:menuId}).then(res=>{
          setConfList(res.data.data)
        })
      }else{
        setConfList([])
      }
      
    }
    const menuItem = ()=>{
      return (
        menuTree.map((item, index) => {
          return (<Menu.Item key={item.id}>{item.name}</Menu.Item>)
        })
      )
    }
    //点击树设置menuid展示对应菜单的config
    const showConfigItem = (e)  =>{
      setIsLoading(true)
      setMenuId(e.key);
      setTimeout(()=>{
        setIsLoading(false)
      },500)
      
    }
    const showModal=(record)=>{
      if(record.id){
          setFormData(record)         
          setTitle('修改配置项【'+record.name+'】')
      }else{
        setFormData({moduleID:menuId})
        setTitle('新增配置项')
      }
      setTimeout(()=>{
        formRef.current.init()
      },300)
      setVisible(true)
    }
    const deleteData = (id)=>{
      confirm({
        title: '删除确认?',
        content: '删除后无法恢复，请谨慎操作！！',
        onOk() {
          _configDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getConfigList()
            }
          })
        },
        onCancel() {
          //console.log('Cancel');
        },
      }); 
    }
    const handleCancel = ()=>{
      setVisible(false)
    }
    const handleOk = ()=>{
        setConfirmLoading(true)
        formRef.current.submitFormData()
        setTimeout(()=>{
          setConfirmLoading(false)
          getConfigList()
        },300)
    }

    useEffect(()=>{
        getMenuTree()
      },[])
    const columns = [
        {
          title: '配置项名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '调用名',
          dataIndex: 'ename',
          key: 'ename',
        },
        {
          title: '字段类型',
          dataIndex: 'fieldType',
          key: 'fieldType',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button type="link" size='small'  onClick={() => showModal(record)}><Icon type="edit" />修改</Button>
                <Divider type="vertical" />
                <Button type="link" size='small'  onClick={() => deleteData(record.id)}><Icon type="delete" />删除</Button>
              </span>
            ),
        },
    ];  
    return (
        <div className='main-content'>
            <Row>
                <Col span={4} style={{paddingRight:'10px',borderRight:'1px solid #e8e8e8'}}>
                <div><h3>模块</h3></div>
                <Divider className='divider'/>    
                {menuTree && menuTree.length?
                  <Menu 
                  onClick = {showConfigItem}
                  >
                    {menuItem()}
                  </Menu>
                  : '暂无数据' }   
                </Col>
                
                <Col span={20} style={{paddingLeft:'10px'}}>
                  <Button type="primary" onClick={showModal} size="large"><Icon type="plus"/> 添加</Button>
                  <Divider className='divider'/>
                  <Spin tip="Loading..." spinning={isLoading}>
                  {confList && confList.length? 
                    <Table rowKey="id" 
                    dataSource={confList} 
                    columns={columns} 
                    pagination={false} 
                    />
                      : '暂无数据' }
                  </Spin>
                </Col>
            </Row>
            <Modal
            width={720}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <ConfForm cRef={formRef} params={formData} menuOption={menuTree} handleCancel={handleCancel}/>
            </Modal>
        </div>
    )
}
export default ConfList