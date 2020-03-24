/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime: 2020-03-24 18:38:23
 * @LastEditors: Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_cmsTagList,_cmsTagDelete,_langList} from '../../../utils/api'
import {Table ,Divider ,Icon ,Tabs ,Button ,Modal,message,Spin} from 'antd';
import TagForm from './Form'
const { TabPane } = Tabs;
const { confirm } = Modal;
const TagList = (props)=>{
    const [isLoading,setIsLoading] = useState(false)
    const [tagList,setTagList] = useState([])
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增博客标签')
    const [formData,setFormData] = useState({})
    const [langList,setLangList] = useState([])

    const formRef = useRef();

    //获取权限规则列表
    const getList = ()=>{
      setIsLoading(true)
      _cmsTagList({},props.match.params.site).then(res=>{
        setTagList(res.data.data)
      })
      setTimeout(()=>{
        setIsLoading(false)
      },300)
    }
    

    const showModal=(record)=>{
      if(record.id){
          setFormData(record)         
          setTitle('修改博客标签【'+record.name+'】')
      }else{
        setFormData({})  
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
          _cmsTagDelete(id,props.match.params.site).then(res=>{
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

    const selectData = (lang)=>{
      let arr = []
      tagList.forEach(item => {
        if(item.lang===lang || item.lang===null||item.lang==='common'){
          arr.push(item)
        }
      });
      return arr
    }

    useEffect(()=>{
      setIsLoading(true)
      _cmsTagList({},props.match.params.site).then(res=>{
        setTagList(res.data.data)
      })
      _langList().then(res=>{
        setLangList(res.data.data)
      })
      setTimeout(()=>{
        setIsLoading(false)
      },300)
      },[props.match.params.site])
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
            <Tabs defaultActiveKey={langList.length?langList[0].ename:'common'} >
              {langList && langList.length? 
              langList.map(item => (
                <TabPane tab={item.name} key={item.ename}>
                  <Spin tip="Loading..." spinning={isLoading}>
                  {selectData(item.ename) && selectData(item.ename).length? 
                    <Table rowKey="id" 
                    dataSource={selectData(item.ename)} 
                    columns={columns} 
                    pagination={false} 
                    />
                      : '暂无数据' }
                  </Spin>
                </TabPane>
              ))
              :
              <TabPane tab="通用" key="common">
                <Spin tip="Loading..." spinning={isLoading}>
                {tagList && tagList.length? 
                  <Table rowKey="id" 
                  dataSource={tagList} 
                  columns={columns} 
                  pagination={false} 
                  />
                    : '暂无数据' }
                </Spin>
              </TabPane>}
            </Tabs>
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
            site = {props.match.params.site}
            langList={langList}
            handleCancel={handleCancel}/>
            </Modal>
        </div>
    )
}
export default TagList