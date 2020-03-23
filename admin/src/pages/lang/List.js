/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime: 2020-03-23 14:41:01
 * @LastEditors: Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_langList,_langDelete} from '../../utils/api'
import {Table ,Divider ,Icon  ,Button ,Modal,message,Spin} from 'antd';
import TagForm from './Form'

const { confirm } = Modal;
const LangList = (props)=>{
    const [isLoading,setIsLoading] = useState(false)
    const [langList,setLangList] = useState([])
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增语言类型')
    const [formData,setFormData] = useState({})
    const formRef = useRef();

    //获取语言类型列表
    const getList = ()=>{
      setIsLoading(true)
      _langList().then(res=>{
        setLangList(res.data.data)
      })
      setTimeout(()=>{
        setIsLoading(false)
      },300)
    }
    

    const showModal=(record)=>{
      if(record.id){
          setFormData(record)         
          setTitle('修改语言类型【'+record.name+'】')
      }else{
        setFormData({})  
        setTitle('新增语言类型')
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
          _langDelete(id,props.match.params.site).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getList()
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
          getList()
        },300)
    }
    
    useEffect(()=>{
      setIsLoading(true)
      _langList().then(res=>{
        setLangList(res.data.data)
      })
      setTimeout(()=>{
        setIsLoading(false)
      },300)
      },[props.match.params.site])
    const columns = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '调用名称',
          dataIndex: 'ename',
          key: 'ename',
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
        },
        {
          title: '最后修改',
          dataIndex: 'last_editor',
          key: 'last_editor',
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
            <Button type="primary" onClick={showModal} size="large"><Icon type="plus"/> 添加</Button>
            <Divider className='divider'/>
            <Spin tip="Loading..." spinning={isLoading}>
            {langList && langList.length? 
              <Table rowKey="id" 
              dataSource={langList} 
              columns={columns} 
              />
                : '暂无数据' }
            </Spin>
            <Modal
            width={720}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <TagForm 
            cRef={formRef} 
            params={formData}  
            handleCancel={handleCancel}/>
            </Modal>
        </div>
    )
}
export default LangList