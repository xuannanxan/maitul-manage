/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-01-30 19:56:44
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_blogTagList,_blogTagDelete} from '../../../utils/api'
import {Table ,Divider ,Icon  ,Button ,Modal,message,Spin} from 'antd';
import RuleForm from './Form'

const pageSize = 8
const { confirm } = Modal;
const BlogTagList = ()=>{
    const [isLoading,setIsLoading] = useState(false)
    const [tagList,setTagList] = useState([])
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增博客标签')
    const [formData,setFormData] = useState({})
    const [tagTotal,setTagTotal] = useState('')
    const [currentPage,setCurrentPage] = useState(1)
    const formRef = useRef();

    //获取权限规则列表
    const getList = (page = currentPage)=>{
      setIsLoading(true)
      _blogTagList({page:page,paginate:pageSize}).then(res=>{
        setTagList(res.data.data)
        setTagTotal(res.data.paginate.total)
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
      if(record.id){
          setFormData(record)         
          setTitle('修改博客标签【'+record.name+'】')
      }else{
        setTitle('新增博客标签')
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
          _blogTagDelete(id).then(res=>{
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
      _blogTagList({page:1,paginate:pageSize}).then(res=>{
        setTagList(res.data.data)
        setTagTotal(res.data.paginate.total)
      })
      setTimeout(()=>{
        setIsLoading(false)
      },300)
      },[])
    const columns = [
        {
          title: '标签名称',
          dataIndex: 'name',
          key: 'name',
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
            {tagList && tagList.length? 
              <Table rowKey="id" 
              dataSource={tagList} 
              columns={columns} 
              pagination={{
                total: tagTotal,
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
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <RuleForm cRef={formRef} params={formData}  handleCancel={handleCancel}/>
            </Modal>
        </div>
    )
}
export default BlogTagList