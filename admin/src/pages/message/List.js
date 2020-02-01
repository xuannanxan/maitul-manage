/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-02-01 22:13:16
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_messageList,_messageDelete} from '../../utils/api'
import {Table ,Divider ,Icon  ,Button ,Modal,message,Spin} from 'antd';
import ReplyForm from './Form'

const pageSize = 8
const { confirm } = Modal;
const MessageList = (props)=>{
    const [isLoading,setIsLoading] = useState(false)
    const [messageList,setMessageList] = useState([])
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [formData,setFormData] = useState({})
    const [messageTotal,setMessageTotal] = useState('')
    const [currentPage,setCurrentPage] = useState(1)
    const formRef = useRef();

    //获取权限规则列表
    const getList = (page = currentPage)=>{
      setIsLoading(true)
      _messageList({page:page,paginate:pageSize,site:props.match.params.site}).then(res=>{
        setMessageList(res.data.data)
        setMessageTotal(res.data.paginate.total)
      })
      setTimeout(()=>{
        setIsLoading(false)
      },300)
    }
    
    const getCurrentList = (page)=>{
      getList(page)
      setCurrentPage(page)
    }

    const showModal=(record)=>{
      setFormData(record)           
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
          _messageDelete({id:id,site:props.match.params.site}).then(res=>{
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
      _messageList({page:currentPage,paginate:pageSize,site:props.match.params.site}).then(res=>{
        setMessageList(res.data.data)
        setMessageTotal(res.data.paginate.total)
      })
      setTimeout(()=>{
        setIsLoading(false)
      },300)
      },[props.match.params.site])
    const columns = [

        {
          title: '留言时间',
          dataIndex: 'create_time',
          key: 'create_time',
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          key: 'ip',
        },
        {
          title: '联系人',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '联系方式',
          dataIndex: 'contact',
          key: 'contact',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: '内容',
          dataIndex: 'info',
          key: 'info',
        },
       
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button type="link" size='small'  onClick={() => showModal(record)}><Icon type="export" />回复</Button>
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
            {messageList && messageList.length? 
              <Table rowKey="id" 
              dataSource={messageList} 
              columns={columns} 
              pagination={{
                total: messageTotal,
                pageSize:pageSize,
                showTotal:(total, range) => `${range[0]}-${range[1]} 总计: ${total} `,
                defaultCurrent:currentPage,
                current:currentPage,
                onChange:(page)=>getCurrentList(page)
              }}
              />
                : '暂无数据' }
            </Spin>
            <Modal
            width={720}
            title='留言回复'
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <ReplyForm 
            cRef={formRef} 
            params={formData}  
            site = {props.match.params.site}
            handleCancel={handleCancel}/>
            </Modal>
        </div>
    )
}
export default MessageList