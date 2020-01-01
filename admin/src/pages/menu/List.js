/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-01 14:28:32
 * @LastEditTime : 2020-01-01 23:34:58
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {Table ,Divider ,Icon ,Input ,Button ,Modal} from 'antd';
import {_menuTree} from '../../utils/api'
import Highlighter from 'react-highlight-words';
import MenuForm from './Form'

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
                <a onClick={() => showFormModal(record)}><Icon type="edit" /> 修改</a>
                <Divider type="vertical" />
                <a><Icon type="delete" /> 删除</a>
              </span>
            ),
        },
    ];
    
    const showFormModal = (record)=>{
        if(record.id){
            setEditData(record)
            setTitle('修改菜单【'+record.name+'】')
        }else{
            setEditData({})
            setTitle('新增菜单')
        }
        setVisible(true)
        setTimeout(()=>{
            formRef.current.init()
        },100)
        
    }
    const handleCancel = ()=>{
        setVisible(false)
    }
    const handleOk = ()=>{
        setConfirmLoading(true)
        setVisible(false)
    }
    useEffect(()=>{
        getMenuTree()
      },[])
    return(
        <div>
            <Button type="primary" onClick={showFormModal} size="large"><Icon type="plus"/> 添加</Button>
            <br /><br />
            <Table rowKey="id" dataSource={menuTree} columns={columns} />
            <Modal
            width={600}
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <MenuForm cRef={formRef} params={editData} menuTree={menuTree}/>
            </Modal>
        </div>
        
    )

}
export default MenuList