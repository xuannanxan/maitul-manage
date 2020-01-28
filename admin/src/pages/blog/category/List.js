/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-01 14:28:32
 * @LastEditTime : 2020-01-28 13:59:22
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {Table ,Divider ,Icon ,Button ,Modal,message} from 'antd';
import {_blogCategoryList ,_blogCategoryDelete } from '../../../utils/api'
import CategoryForm from './Form'

const { confirm } = Modal;

function CategoryList(){
    const [dataTree,setDataTree] = useState([])
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增菜单')
    const [editData,setEditData] = useState({})
    const formRef = useRef();
    // 获取分类树
    const getCategoryTree = ()=>{
      _blogCategoryList().then(res=>{
          setDataTree(res.data.data)
        })
      }

    const columns = [
        {
          title: '分类名称',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => (
            <span>
              <Icon type={record.icon}/>{record.name}
            </span>
          ),
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
          _blogCategoryDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getCategoryTree()
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
            setTitle('修改分类【'+record.name+'】')
        }else{
            setEditData({})
            setTitle('新增分类')
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
          getCategoryTree()
        },500)
    }

    useEffect(()=>{
        getCategoryTree()
      },[])
    return(
        <div className='main-content'>
            <Button type="primary" onClick={showFormModal} size="large"><Icon type="plus"/> 添加</Button>
            <Divider className='divider'/>
            {dataTree && dataTree.length? 
            <Table rowKey="id" 
            dataSource={dataTree} 
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
            <CategoryForm cRef={formRef} params={editData} dataTree={dataTree} handleCancel={handleCancel} />
            </Modal>
        </div>
        
    )

}
export default CategoryList