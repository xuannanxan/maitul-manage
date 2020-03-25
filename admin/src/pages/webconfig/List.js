/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime: 2020-03-25 15:29:42
 * @LastEditors: Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_configList,_configDelete,_langList} from '../../utils/api'
import {Table ,Divider ,Icon ,Menu ,Button ,Tabs ,Modal,message,Col,Row,Spin} from 'antd';
import ConfForm from './Form'
import {webSites} from '../config'
const { TabPane } = Tabs;
const { confirm } = Modal;
const ConfList = ()=>{
    const [langList,setLangList] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [confList,setConfList] = useState([])
    const [site,setSite] = useState(webSites[0].site)
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增权限规则')
    const [formData,setFormData] = useState({})
    const formRef = useRef();

    const initData = ()=>{
      _configList().then(res=>{
        setConfList(res.data.data)
      })
      _langList().then(res=>{
        setLangList(res.data.data)
      })
    }
   
    const sitesItem = ()=>{
      return (
        webSites.map((item, index) => {
          return (<Menu.Item key={item.site}>{item.name}</Menu.Item>)
        })
      )
    }
    //点击树设置menuid展示对应菜单的config
    const showConfigItem = (e)  =>{
      setIsLoading(true)
      setSite(e.key);
      setTimeout(()=>{
        setIsLoading(false)
      },500)
      
    }
    const showModal=(record)=>{
      if(record.id){
          setFormData(record)         
          setTitle('修改配置项【'+record.name+'】')
      }else{
        setFormData({site:site})
        setTitle('新增配置项')
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
          _configDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              initData()
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
          initData()
        },300)
    }

    const selectData = (lang)=>{
      let arr = []
      if(confList[site]){
        confList[site].forEach(item => {
          if(item.lang===lang || item.lang===null||item.lang==='common'){
            arr.push(item)
          }
        });
      }
      return arr
    }
    

    useEffect(()=>{
        initData()
      },[])

    const columns = [
        {
          title: '配置项名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '调用名',
          dataIndex: 'ename',
          key: 'ename',
        },
        {
          title: '字段类型',
          dataIndex: 'fieldType',
          key: 'fieldType',
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
                <div><h3>模块</h3></div>
                <Divider className='divider'/>    
                {webSites && webSites.length?
                  <Menu 
                  onClick = {showConfigItem}
                  defaultSelectedKeys={[site]}
                  >
                    {sitesItem()}
                  </Menu>
                  : '暂无数据' }   
                </Col>
                
                <Col span={20} style={{paddingLeft:'10px'}}>
                  <Button type="primary" onClick={showModal} size="large"><Icon type="plus"/> 添加</Button>
                  <Divider className='divider'/>
                  <Tabs defaultActiveKey={langList.length?langList[0].ename:'common'}>
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
                        {confList[site] && confList[site].length? 
                          <Table rowKey="id" 
                          dataSource={confList[site]} 
                          columns={columns} 
                          pagination={false} 
                          />
                            : '暂无数据' }
                      </Spin>
                    </TabPane>}
                  </Tabs>
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
            <ConfForm cRef={formRef} params={formData} langList={langList} handleCancel={handleCancel} />
            </Modal>
        </div>
    )
}
export default ConfList