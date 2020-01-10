/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-01 14:28:32
 * @LastEditTime : 2020-01-10 15:20:05
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {Table ,Divider ,Icon ,Input ,Button ,Modal,message} from 'antd';
import {_menuTree ,_menuDelete } from '../../utils/api'
import Highlighter from 'react-highlight-words';
import MenuForm from './Form'

const { confirm } = Modal;

function MenuList(props){
    const [menuTree,setMenuTree] = useState([])
    const [searchText,setSearchText] = useState('')
    const [searchedColumn,setSearchedColumn] = useState('')
    const [visible,setVisible] = useState(false)
    const [confirmLoading,setConfirmLoading] = useState(false)
    const [title,setTitle] = useState('新增菜单')
    const [editData,setEditData] = useState({})
    const formRef = useRef();
    // 获取菜单树
    const getMenuTree = ()=>{
        _menuTree().then(res=>{
            setMenuTree(res.data.data)
        })
      }
    // 查询
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              搜索
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </div>
        ), 
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
          ),
        onFilter: (value, record) =>
            record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
              //setTimeout(() => this.searchInput.select());
            }
          },
        render: text =>
                searchedColumn === dataIndex ? (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text.toString()}
              />
            ) : (
              text
            ),
    });
    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };
    const columns = [
        {
          title: '菜单名称',
          dataIndex: 'name',
          key: 'name',
          ...getColumnSearchProps('name'),
          render: (text, record) => (
            <span>
              <Icon type={record.icon}/>{record.name}
            </span>
          ),
        },
        {
          title: 'URL',
          dataIndex: 'url',
          key: 'url',
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
          _menuDelete(id).then(res=>{
            if(res.data.status===200){
              message.success(res.data.msg)
              getMenuTree()
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
            setTitle('修改菜单【'+record.name+'】')
        }else{
            setEditData({})
            setTitle('新增菜单')
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
        },500)
    }

    useEffect(()=>{
        getMenuTree()
      },[])
    return(
        <div>
            <Button type="primary" onClick={showFormModal} size="large"><Icon type="plus"/> 添加</Button>
            <br /><br />
            {menuTree && menuTree.length? 
            <Table rowKey="id" 
            dataSource={menuTree} 
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
            <MenuForm cRef={formRef} params={editData} menuTree={menuTree} handleCancel={handleCancel} refreshMenu = {getMenuTree}/>
            </Modal>
        </div>
        
    )

}
export default MenuList