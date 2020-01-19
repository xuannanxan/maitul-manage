/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-15 14:44:39
 * @LastEditTime : 2020-01-19 13:43:42
 * @LastEditors  : Xuannan
 */
import React, {useImperativeHandle,useState} from 'react';
import {_adminAuth} from '../../utils/api'
import { Select,message} from 'antd';
const { Option } = Select;
const AuthForm = (props)=>{
    let {params,handleCancel} = props
    const [roleOption,setRoleOption] = useState([])
    const [selectedValue,setSelectedValue] = useState([])
    const handleChange= (value)=>{
        setSelectedValue(value)
    }
    useImperativeHandle(props.cRef, () => ({
        // 暴露给父组件的方法
        submitFormData:()=>{
            _adminAuth({id:params.id,roles:JSON.stringify(selectedValue)}).then(res=>{
                if(res.data.status === 200){
                    message.success(res.data.msg)
                    handleCancel()
                }
            })
        },
        init:()=>{
            if(params){
                setSelectedValue(params.roles?params.roles.split(','):[])
                setRoleOption(params.roleList.map((item,index)=>{
                    return(<Option key={item.id}>{item.name}</Option>)
                }))
                
            }
        }

    }));
 
    return (
        <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择角色"
            value={selectedValue}
            onChange={handleChange}
        >
            {roleOption}
        </Select>
    )
}

export default AuthForm