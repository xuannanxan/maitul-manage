/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-09 16:36:45
 * @LastEditTime : 2020-01-09 18:48:48
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_menuTree  } from '../../utils/api'
import {Table ,Tree ,Divider ,Icon ,Input ,Button ,Modal,message,Col,Row,Spin} from 'antd';
const { TreeNode } = Tree;
const RuleList = ()=>{
    const [isLoading,setIsLoading] = useState(true)
    const [menuTree,setMenuTree] = useState([])
    // 获取菜单树
    const getMenuTree = ()=>{
        _menuTree().then(res=>{
            setMenuTree(res.data.data)
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
    useEffect(()=>{
        getMenuTree()
        
      },[])
      
    return (
        <div>
            <Row>
                <Col span={4}>
                {menuTree && menuTree.length?
                <Tree
                showIcon
                blockNode
                >
                    {loop(menuTree)}
                </Tree>
                : '暂无数据' }        
                </Col>
                <Col span={20}>
                    <Spin tip="Loading..." spinning={isLoading}>

                    </Spin>
                </Col>
            </Row>
        </div>
    )
}
export default RuleList