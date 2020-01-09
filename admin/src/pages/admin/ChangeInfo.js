/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-08 13:49:14
 * @LastEditTime : 2020-01-09 16:24:10
 * @LastEditors  : Xuannan
 */
import React, {useImperativeHandle} from 'react';
import { Input ,Form ,message} from 'antd';
import {_changeUserInfo} from '../../utils/api'

function ChangeUserInfoForm(props){
    let {cRef,form,params,handleCancel,refreshUser} = props
    const { getFieldDecorator } = form; //表单内容
    useImperativeHandle(cRef, () => ({
        changeUserInfo:()=>{
            form.validateFields((err, values) => {
                if (!err) {
                    _changeUserInfo(values).then(res=>{
                        if(res.data.status === 200){
                            message.success(res.data.msg)
                            handleCancel()
                            refreshUser()
                        }
                    })
                }
                });
        },
        init:()=>{
            if(params){
                form.setFieldsValue({
                    name:params.name,
                    email:params.email,
                    phone:params.phone
                })
            }
        }
    }))
    return(
        <div>
        <Form className="content-form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item label='姓 名'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入姓名...' }],
                    })(
                        <Input 
                        placeholder="请输入姓名..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='E-mail'>
                    {getFieldDecorator('email', {
                        rules: [
                            { required: true, message: '请输入邮箱地址...' },
                            {pattern:/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,message:'邮箱格式错误'}
                    ],
                    })(
                        <Input 
                        placeholder="请输入邮箱地址..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='手机号码'>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入手机号码...' }],
                    })(
                        <Input 
                        placeholder="请输入手机号码..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                </Form>
        </div>
    )
}
const ChangeUserInfo = Form.create({name:'user_info_form'})(ChangeUserInfoForm)
export default ChangeUserInfo