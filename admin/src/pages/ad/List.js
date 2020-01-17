/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-01 14:28:32
 * @LastEditTime : 2020-01-17 13:56:17
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {Table ,Divider ,Icon ,Input ,Button ,Modal,message} from 'antd';
import {_adList ,_adSpaceList,_adDelete } from '../../utils/api'
import AdForm from './Form'

const { confirm } = Modal;

const AdList = ()=>{
    const [adSpaceList,setAdSpaceList] = useState([])
    const [spaceId,setSpaceId] = useState('')
    const [adList,setAdList] = useState([])
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增菜单')
    const [editData,setEditData] = useState({})
    const formRef = useRef();
    // 获取广告位
    const getAdSpaceList = ()=>{
      _adSpaceList().then(res=>{
        setAdSpaceList(res.data.data)
        })
      }
    // 获取广告
    const getAdList = (space_id)=>{
      setSpaceId(space_id)
      _adList({space_id:space_id}).then(res=>{
        setAdList(res.data.data)
        })
      }
    const columns = [
        {
          title: '图片',
          dataIndex: 'img',
          key: 'img',
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '广告链接',
          dataIndex: 'url',
          key: 'url',
        },
        {
          title: '描述',
          dataIndex: 'info',
          key: 'info',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button type="link" size='small'  onClick={() => showFormModal(record)}><Icon type="edit" />修改</Button>
                <Divider type="vertical" />
                <Button type="link" size='small'  onClick={() => deleteData(record.id)}><Icon type="delete" />删除</Button>
              </span>
            ),
        },
    ];
    const deleteData = (id)=>{
      confirm({
        title: '删除确认?',
        content: '删除后无法恢复，请谨慎操作！！',
        onOk() {
          _adDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getAdList(spaceId)
            }
          })
        },
        onCancel() {
          //console.log('Cancel');
        },
      }); 
    }
    const showFormModal = (record)=>{
        if(record.id){
            setEditData(record)
            setTitle('修改广告【'+record.name+'】')
        }else{
            setEditData({})
            setTitle('新增广告')
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
        getAdList(spaceId)
        setTimeout(()=>{
          setConfirmLoading(false)
        },500)
    }

    useEffect(()=>{
        getAdSpaceList()
      },[])
    return(
        <div className='main-content'>
            <Button type="primary" onClick={showFormModal} size="large"><Icon type="plus"/> 添加</Button>
            <Divider className='divider'/>
            {adList && adList.length? 
            <Table rowKey="id" 
            dataSource={adList} 
            columns={columns} 
            pagination={false} 
            defaultExpandAllRows={true}/>
              : '暂无数据' }
            
            <Modal
            width={600}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <AdForm cRef={formRef} params={editData} handleCancel={handleCancel}/>
            </Modal>
        </div>
        
    )

}
export default AdList