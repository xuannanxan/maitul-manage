/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-01 14:28:32
 * @LastEditTime : 2020-01-17 23:33:39
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {Table ,Divider ,Icon ,Spin,Avatar ,Menu,Row,Col ,Button ,Modal,message} from 'antd';
import {_adList ,_adSpaceList,_adDelete } from '../../utils/api'
import AdForm from './Form'

const { confirm } = Modal;

const AdList = ()=>{
    const [adSpaceList,setAdSpaceList] = useState([])
    const [spaceId,setSpaceId] = useState('')
    const [adList,setAdList] = useState([])
    const [visible,setVisible] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
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
    const getAdList = (e)=>{
      setIsLoading(true)
      setSpaceId(e.key)
      _adList({space_id:e.key}).then(res=>{
        setAdList(res.data.data)
        })
      }
      setTimeout(()=>{
        setIsLoading(false)
      },300)
    const MenuItem = ()=>{
      return (
        adSpaceList.map((item, index) => {
          return (<Menu.Item key={item.id}>{item.name}</Menu.Item>)
        })
      )
    }
    const columns = [
        {
          title: '图片',
          dataIndex: 'img',
          key: 'img',
          render: (text, record) => (
            <span>
              <Avatar shape="square" size="large" src ={record.img} />
            </span>
          ),
          
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
              _adList({space_id:spaceId}).then(res=>{
                setAdList(res.data.data)
                })
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
            setEditData({space_id:spaceId})
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
        _adList({space_id:spaceId}).then(res=>{
          setAdList(res.data.data)
          })
        setTimeout(()=>{
          setConfirmLoading(false)
        },500)
    }

    useEffect(()=>{
        getAdSpaceList()
      },[])
    return(
        <div className='main-content'>
          <Row>
                <Col span={4} style={{paddingRight:'10px',borderRight:'1px solid #e8e8e8'}}>
                <div><h3>广告位</h3></div>
                <Divider className='divider'/>
                {adSpaceList && adSpaceList.length?
                <Menu 
                onClick = {getAdList}
                >
                  {MenuItem()}
                </Menu>
                : '暂无数据' }     
                </Col>
                
                <Col span={20} style={{paddingLeft:'10px'}}>
                  <Button type="primary" onClick={showFormModal} size="large"><Icon type="plus"/> 添加</Button>
                  <Divider className='divider'/>
                  <Spin tip="Loading..." spinning={isLoading}>
                  {adList && adList.length? 
                  <Table rowKey="id" 
                  dataSource={adList} 
                  columns={columns} 
                  pagination={false} 
                  defaultExpandAllRows={true}/>
                    : '暂无数据' }
                  </Spin>
                </Col>
            </Row>
            <Modal
            width={600}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <AdForm cRef={formRef} params={editData} adSpaceList={adSpaceList} handleCancel={handleCancel}/>
            </Modal>
        </div>
        
    )

}
export default AdList