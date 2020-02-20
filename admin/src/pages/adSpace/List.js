/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-01 14:28:32
 * @LastEditTime: 2020-02-20 19:38:02
 * @LastEditors: Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {Table ,Divider ,Icon  ,Button ,Modal,message} from 'antd';
import {_adSpaceList ,_adSpaceDelete } from '../../utils/api'
import AdSpaceForm from './Form'

const { confirm } = Modal;

const AdSpaceList = ()=>{
    const [adSpaceList,setAdSpaceList] = useState([])
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
  
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
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
          title: '最后修改时间',
          dataIndex: 'update_time',
          key: 'update_time',
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
          _adSpaceDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getAdSpaceList()
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
            setTitle('修改广告位【'+record.name+'】')
        }else{
            setEditData({})
            setTitle('新增广告位')
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
        getAdSpaceList()
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
            {adSpaceList && adSpaceList.length? 
            <Table rowKey="id" 
            dataSource={adSpaceList} 
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
            <AdSpaceForm cRef={formRef} params={editData} handleCancel={handleCancel}/>
            </Modal>
        </div>
        
    )

}
export default AdSpaceList