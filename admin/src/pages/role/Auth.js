/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-13 16:05:42
 * @LastEditTime : 2020-01-13 22:00:40
 * @LastEditors  : Xuannan
 */
import React, { useImperativeHandle,useState} from 'react';
import { Checkbox ,message} from 'antd';
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
            handleCancel()
        
        },
        init:()=>{
            if(params){
                setMenuTree(params.menu)
                setRuleList(params.rule)
            }
        }
    }));
    const onChange = (e)=>{
        //checkedList,
        setIndeterminate(!!checkedList.length && checkedList.length < e.length)
        setCheckAll(checkedList.length === e.length)
    }
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? e : [])
        setCheckAll(e.target.checked)
        setIndeterminate(false)
      };
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
                            <div key={menu.id} style={{marginLeft: '10px'}}>
                                <h4>{menu.name}</h4>
                                {rulesCheckboxGroup(menu.children,ruleData)}
                                <br />
                            </div>
                        )  
                    }else{
                        return (
                            <div key={menu.id} style={{marginLeft: '10px'}}>
                                <div style={{ borderBottom: '1px solid #E9E9E9'}}>
                                    <Checkbox
                                    indeterminate={indeterminate}
                                    onChange={onCheckAllChange}
                                    checked={checkAll}
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
                                    onChange={onChange}
                                    />
                                    :'该菜单无需授权...'
                                 }
                                 
                            </div>
                        )
                    }
                } 
            })
        )
    }
    return(
        <div>
        {menuTree && menuTree.length? rulesCheckboxGroup(menuTree,ruleList):'无可设置的权限...'}
        </div>
    )
}

export default AuthForm