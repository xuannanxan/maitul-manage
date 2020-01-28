/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-01-28 22:18:54
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_blogCategoryList,_blogContentList,_blogContentDelete} from '../../../utils/api'
import {Table ,Tree ,Divider ,Icon  ,Button ,Modal,message,Col,Row,Spin} from 'antd';

const { TreeNode } = Tree;
const { confirm } = Modal;
const ContentList = ()=>{
    const [isLoading,setIsLoading] = useState(false)
    const [dataTree,setDataTree] = useState([])
    const [dataOption,setDataOption] = useState([])
    const [contentList,setContentList] = useState([])
    const [categoryId,setCategoryId] = useState('')
    const [title,setTitle] = useState('新增权限规则')
    const [formData,setFormData] = useState({})
    const formRef = useRef();

    const getDataTree = ()=>{
        _blogCategoryList().then(res=>{
            setDataTree(res.data.data)
      })
    }
    //获取内容列表
    const getContentList = (cateId = categoryId)=>{
        if(cateId){
            _blogContentList({category_id:cateId}).then(res=>{
                setContentList(res.data.data)
          })
        } 
    }
    const loop = (data) =>{
        return data.map(item => {
            if (item.children && item.children.length) {
              return (
                <TreeNode key={item.id} title={item.name} icon={<Icon type={item.icon} />}> 
                  {loop(item.children)}
                </TreeNode>
              );
            }
            return <TreeNode key={item.id} title={item.name} icon={<Icon type={item.icon} />}/>;
          });  
    }
    //点击树设置menuid展示对应菜单的rule
    const showContentList = (selectedKeys, info)  =>{
      setIsLoading(true)
      getContentList(selectedKeys[0]);
      setTimeout(()=>{
        setIsLoading(false)
      },500) 
    }
   
    const deleteData = (id)=>{
      confirm({
        title: '删除确认?',
        content: '删除后无法恢复，请谨慎操作！！',
        onOk() {
            _blogContentDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getContentList()
            }
          })
        },
        onCancel() {
          //console.log('Cancel');
        },
      }); 
    }
   
    const initTreeData = (data)=>{
      return data.map((v,k)=>{
          let children = []
          if (v.children.length>0){
              children=initTreeData(v.children)
              }
          return { key: v.id, value: v.id, title: v.name,children:children}
      })
    }
    useEffect(()=>{
        getDataTree()
      },[])
    const columns = [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '点击次数',
          dataIndex: 'click',
          key: 'click',
        },
        {
          title: '作者',
          dataIndex: 'author',
          key: 'author',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button type="link" size='small'  ><Icon type="edit" />修改</Button>
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
                <div><h3>内容分类</h3></div>
                <Divider className='divider'/>
                {dataTree && dataTree.length?
                <Tree
                showIcon
                blockNode
                defaultExpandAll={true}
                onSelect={showContentList}
                >
                    {loop(dataTree)}
                </Tree>
                : '暂无数据' }     
                </Col>
                
                <Col span={20} style={{paddingLeft:'10px'}}>
                  <Button type="primary"  size="large"><Icon type="plus"/> 添加</Button>
                  <Divider className='divider'/>
                  <Spin tip="Loading..." spinning={isLoading}>
                  {contentList && contentList.length? 
                    <Table rowKey="id" 
                    dataSource={contentList} 
                    columns={columns} 
                    pagination={false} 
                    defaultExpandAllRows={true}/>
                      : '暂无数据' }
                  </Spin>
                </Col>
            </Row>
            
        </div>
    )
}
export default ContentList