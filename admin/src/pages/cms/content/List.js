/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime: 2020-02-28 10:02:05
 * @LastEditors: Xuannan
 */
import React, { useState,useEffect ,useRef , useReducer} from 'react';
import {_cmsTagList , _cmsCategoryList,_cmsContentList,_cmsContentDelete} from '../../../utils/api'
import {Table ,Tree ,Divider ,Avatar ,Icon ,Input ,Button ,Modal,message,Col,Row,Spin} from 'antd';
import ContentForm from './Form';
const pageSize = 8
const { TreeNode } = Tree;
const { confirm } = Modal;
const { Search } = Input;
const ContentList = (props)=>{
    const [isLoading,setIsLoading] = useState(false)
    const [dataTree,setDataTree] = useState([])
    const [dataOption,setDataOption] = useState([])
    const [contentList,setContentList] = useState([])
    const [categoryId,setCategoryId] = useState('')
    const [title,setTitle] = useState('正在新增内容...')
    const [formData,setFormData] = useState({})
    const [tagList,setTagList] = useState([])
    const [dataTotal,setDataTotal] = useState('')
    const [searchKeywords,setSearchKeywords] = useState('')
    const [currentPage,setCurrentPage] = useState(1)
    const formRef = useRef();

    const [content,setContent] = useReducer((state,action)=>{
      if(action==='list'){
        return 'list'
      }
      return ''
    },'list');


    //获取内容列表
    const getContentList = (cateId = categoryId,page = currentPage,search=searchKeywords)=>{
            _cmsContentList({category_id:cateId,page:page,paginate:pageSize,search:search},props.match.params.site).then(res=>{
                setContentList(res.data.data)
                setDataTotal(res.data.paginate.total)
          })
          .catch(error=>{
            setContentList([])
          })
          //如果分类不是当前选中的，就重新设置选中分类
          if(cateId !== categoryId){
            setCategoryId(cateId)
          }
          if(search){
            setSearchKeywords(search)
          }
    }
    const getCurrentList = (page)=>{
      getContentList(categoryId,page)
      setCurrentPage(page)
    }
    const loop = (data) =>{
        return data.map(item => {
            if (item.children && item.children.length) {
              return (
                <TreeNode className='tree-node' key={item.id} title={item.name} icon={<Icon type={item.icon} />}> 
                  {loop(item.children)}
                </TreeNode>
              );
            }
            return <TreeNode class='tree-node' key={item.id} title={item.name} icon={<Icon type={item.icon} />}/>;
          });  
    }
    //点击树设置category_id展示对应菜单的内容
    const showContentList = (selectedKeys, info)  =>{
      setIsLoading(true)
      setCurrentPage(1)
      getContentList(selectedKeys[0],1,'');
      setCategoryId(selectedKeys[0])
      setTimeout(()=>{
        setIsLoading(false)
      },500) 
    }
   
    const deleteData = (id)=>{
      confirm({
        title: '删除确认?',
        content: '删除后无法恢复，请谨慎操作！！',
        onOk() {
            _cmsContentDelete(id,props.match.params.site).then(res=>{
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
    const handleEdit = (record)=>{
      setDataOption(initTreeData(dataTree))
      setFormData(record)
      setContent('edit')
      setTitle(`正在修改【${record.title}】...`)
      setTimeout(()=>{
        formRef.current.init()
      },300)
    }

    const handleAdd = ()=>{
      setDataOption(initTreeData(dataTree))
      setFormData({category_id:categoryId})
      setContent('add')
      setTitle('正在新增内容...')
      setTimeout(()=>{
        formRef.current.init()
      },300)
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

    const columns = [
        {
          title: '封面图片',
          dataIndex: 'cover',
          key: 'cover',
          render: (text, record) => (
            <span>
              <Avatar shape="square" size="large" src ={record.cover} />
            </span>
          ),
        },
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
          title: '所属分类',
          dataIndex: 'category_name',
          key: 'category_name',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button type="link" size='small' onClick={() => handleEdit(record)} ><Icon type="edit"/>修改</Button>
                <Divider type="vertical" />
                <Button type="link" size='small'  onClick={() => deleteData(record.id)}><Icon type="delete" />删除</Button>
              </span>
            ),
        },
    ]; 


    useEffect(()=>{
      _cmsCategoryList({},props.match.params.site).then(res=>{
        setDataTree(res.data.data)
      })
      _cmsTagList({},props.match.params.site).then(res=>{
        setTagList(res.data.data)
      })
      _cmsContentList({category_id:'',page:1,paginate:pageSize},props.match.params.site).then(res=>{
        setContentList(res.data.data)
        setDataTotal(res.data.paginate.total)
      })
    },[props.match.params.site])
    return (
        <div className='main-content'>
          {content && content==='list'?
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
            selectedKeys={[categoryId]}
            >
                {loop(dataTree)}
            </Tree>
            : '暂无数据' }     
            </Col>
            <Col span={20} style={{paddingLeft:'10px'}}>
              <div>
                <Button type="primary"  size="large" onClick={handleAdd}><Icon type="plus"/>添加</Button>
                <Search
                  placeholder="请输入关键词"
                  onSearch={value => getContentList(categoryId,currentPage,value)}
                  style={{ width: 200 ,float:'right'}}
                  size='large'
                />
                <Divider className='divider'/>
                <Spin tip="Loading..." spinning={isLoading}>
                {contentList && contentList.length? 
                  <Table rowKey="id" 
                  dataSource={contentList} 
                  columns={columns} 
                  pagination={{
                    total: dataTotal,
                    pageSize:pageSize,
                    showTotal:(total, range) => `${range[0]}-${range[1]} 总计: ${total} `,
                    defaultCurrent:currentPage,
                    current:currentPage,
                    onChange:(page)=>getCurrentList(page)
                  }}/>
                    : '暂无数据' }
                </Spin>
              </div>
            </Col>
          </Row>
          :
          <div>
            <h3>{title}</h3>
            <ContentForm 
            cRef={formRef} 
            params={formData} 
            tagList={tagList} 
            dataOption={dataOption} 
            site={props.match.params.site} 
            handleCancel={(cateId)=>{setContent('list');getContentList(cateId)}} 
            />
          </div> 
        }
        </div>
    )
}
export default ContentList