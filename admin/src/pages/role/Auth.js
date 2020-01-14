/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-13 16:05:42
 * @LastEditTime : 2020-01-14 21:36:42
 * @LastEditors  : Xuannan
 */
import React, { useImperativeHandle,useState} from 'react';
import { Checkbox ,message} from 'antd';
import {_roleAuth,_getRole} from '../../utils/api'
const CheckboxGroup = Checkbox.Group;


const AuthForm =(props)=>{

    let {params,handleCancel} = props
    const [menuTree,setMenuTree] = useState([])
    const [ruleList,setRuleList] = useState([])
    const [indeterminate,setIndeterminate] = useState([])
    const [checkedList,setCheckedList] = useState([])
    const [checkAll,setCheckAll] = useState([])

    useImperativeHandle(props.cRef, () => ({
        // 暴露给父组件的方法
        submitFormData:()=>{
            _roleAuth({id:params.id,rules:JSON.stringify(checkedList)}).then(res=>{
                if(res.data.status === 200){
                    message.success(res.data.msg)
                    handleCancel()
                }
            })
        },
        init:()=>{
            if(params){
                _getRole(params.id).then(res=>{
                    if(res.data.data.rules){
                        setCheckedList(res.data.data.rules.split(','))
                    }else{
                        setCheckedList([])
                    }
                })
                setMenuTree(params.menu)
                setRuleList(params.rule)
            }
        }
    }));
    const onChange = (e,groupRuleList,indeterminateId)=>{
        let groupRuleIds = groupRuleList.map((item,index)=>{
            return item.id
        })
        pushChecked(groupRuleIds,e)
        //部分选中，将对应的indeterminate[menu.id]设置为true
        let indeterminateTemp = indeterminate
        indeterminateTemp[indeterminateId] = !!e.length && groupRuleIds.length > e.length
        setIndeterminate(indeterminateTemp)
        //全部选中，将对应的checkAll[menu.id]设置为true
        let checkAllTemp = checkAll
        checkAllTemp[indeterminateId] = groupRuleIds.length === e.length
        setCheckAll(checkAllTemp)
    }
    const onCheckAllChange = (e,menuId) => {
        let groupRuleIds = ruleList[menuId].map((item,index)=>{
            return item.id
        })
        e.target.checked ? pushChecked(groupRuleIds,groupRuleIds) : pushChecked(groupRuleIds,[])
        let checkAllTemp = checkAll
        checkAllTemp[menuId] = e.target.checked
        setCheckAll(checkAllTemp)
        let indeterminateTemp = indeterminate
        indeterminateTemp[menuId] = false
        setIndeterminate(indeterminateTemp)
      };
    const pushChecked=(groupIds,checkIds)=>{
        //新增Checked的数据,如果checkedList有数据才就移除属于groupIds的数据
        if(checkedList.length){
            //移除checkedList中属于当前group的
            let tempArr = []
            checkedList.forEach((item,index)=>{     
                if(groupIds.indexOf(item)=== -1){
                    tempArr.push(item)    //只返回不属于groupIds的数据
                }
            })
            //添加新的选中项
            setCheckedList(tempArr.concat(checkIds)) 
        }else{//没有数据，就直接赋值
            setCheckedList(checkIds)
        }
    }
    const initRuleData = (data)=>{
        return data.map((item,index)=>{
            return {label: item.name, value:item.id }
        })
    }
    const rulesCheckboxGroup = (menuData,ruleData)=>{
        return (
            menuData.map((menu,index)=>{
                if (menu.pid==='0'){
                    return (
                        <div key={menu.id}>
                            <h3>{menu.name}</h3>
                            {rulesCheckboxGroup(menu.children,ruleData)}
                        </div>
                    )  
                }else{
                    if (menu.children.length) {
                        return (
                            <div key={menu.id} style={{marginLeft: '20px'}}>
                                <h4>{menu.name}</h4>
                                {rulesCheckboxGroup(menu.children,ruleData)}
                            </div>
                        )  
                    }else{
                        return (
                            <div key={menu.id} style={{margin: '0 0 20px 20px'}}>
                                <div style={{ borderBottom: '1px solid #E9E9E9'}}>
                                    <Checkbox
                                    indeterminate={indeterminate[menu.id]}
                                    onChange={(e)=>{onCheckAllChange(e,menu.id)} }
                                    checked={checkAll[menu.id]}
                                    disabled = {!(ruleList[menu.id]&&ruleList[menu.id].length)}
                                    >
                                    {menu.name}
                                    </Checkbox>
                                </div>
                                
                                {ruleList[menu.id]&&ruleList[menu.id].length?
                                    <CheckboxGroup
                                    options={
                                        initRuleData(ruleList[menu.id])
                                    }
                                    value={checkedList}
                                    onChange={(e)=>{onChange(e,ruleList[menu.id],menu.id)}}
                                    />
                                    :'该菜单无需授权...'
                                 }
                                 <br />
                            </div>
                        )
                    }
                } 
            })
        )
    }
    return(
        <div style={{maxHeight:'400px',overflowY:'scroll'}}>
        {menuTree && menuTree.length? rulesCheckboxGroup(menuTree,ruleList):'无可设置的权限...'}
        </div>
    )
}

export default AuthForm