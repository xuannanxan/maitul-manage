/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-01-29 21:28:58
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_menuTree,_ruleList,_ruleDelete} from '../../utils/api'
import {Table ,Tree ,Divider ,Icon  ,Button ,Modal,message,Col,Row,Spin} from 'antd';
import RuleForm from './Form'
const { TreeNode } = Tree;
const { confirm } = Modal;
const RuleList = ()=>{
    const [isLoading,setIsLoading] = useState(false)
    const [menuTree,setMenuTree] = useState([])
    const [menuOption,setMenuOption] = useState([])
    const [ruleList,setRuleList] = useState([])
    const [menuId,setMenuId] = useState([])
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增权限规则')
    const [formData,setFormData] = useState({})
    const formRef = useRef();

    const getMenuTree = ()=>{
      _menuTree().then(res=>{
          setMenuTree(res.data.data)
          setMenuOption(initTreeData(res.data.data))
      })
    }
    //获取权限规则列表
    const getRuleList = ()=>{
      _ruleList().then(res=>{
        setRuleList(res.data.data)
      })
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
    const showRuleItem = (selectedKeys, info)  =>{
      setIsLoading(true)
      setMenuId(selectedKeys[0]);
      setTimeout(()=>{
        setIsLoading(false)
      },500)
      
    }
    const showModal=(record)=>{
      if(record.id){
          setFormData(record)         
          setTitle('修改权限规则【'+record.name+'】')
      }else{
        setFormData({menu_id:menuId})
        setTitle('新增权限规则')
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
          _ruleDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getRuleList()
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
          getRuleList()
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
    useEffect(()=>{
        getMenuTree()
        getRuleList()
      },[])
    const columns = [
        {
          title: '权限规则名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'URL',
          dataIndex: 'url',
          key: 'url',
        },
        {
          title: '请求方法',
          dataIndex: 'method',
          key: 'method',
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
            <Row>
                <Col span={4} style={{paddingRight:'10px',borderRight:'1px solid #e8e8e8'}}>
                <div><h3>后台菜单</h3></div>
                <Divider className='divider'/>
                {menuTree && menuTree.length?
                <Tree
                showIcon
                blockNode
                defaultExpandAll={true}
                onSelect={showRuleItem}
                >
                    {loop(menuTree)}
                </Tree>
                : '暂无数据' }     
                </Col>
                
                <Col span={20} style={{paddingLeft:'10px'}}>
                  <Button type="primary" onClick={showModal} size="large"><Icon type="plus"/> 添加</Button>
                  <Divider className='divider'/>
                  <Spin tip="Loading..." spinning={isLoading}>
                  {ruleList[menuId] && ruleList[menuId].length? 
                    <Table rowKey="id" 
                    dataSource={ruleList[menuId]} 
                    columns={columns} 
                    pagination={false} 
                    defaultExpandAllRows={true}/>
                      : '暂无数据' }
                  </Spin>
                </Col>
            </Row>
            <Modal
            width={720}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <RuleForm cRef={formRef} params={formData} menuOption={menuOption} handleCancel={handleCancel}/>
            </Modal>
        </div>
    )
}
export default RuleList