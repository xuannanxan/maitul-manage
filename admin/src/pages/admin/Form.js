/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-13 14:33:08
 * @LastEditTime : 2020-01-15 19:09:42
 * @LastEditors  : Xuannan
 */
import React, { useImperativeHandle} from 'react';
import { Input ,Form,message} from 'antd';
import {_adminAdd} from '../../utils/api'


function SubmitForm(props){
    let { form,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    
    const add=(formData)=>{
        _adminAdd(formData).then(res=>{
            if(res.data.status === 201){
                message.success(res.data.msg)
                handleCancel()
            }
        })
    }

    useImperativeHandle(props.cRef, () => ({
        // 暴露给父组件的方法
        submitFormData:()=>{
            form.validateFields((err, values) => {
                if (!err) {
                    add(values)
                }
                });
        }
    }));
    

    return(
        <div>
            <Form  labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='用户名'>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名...' }],
                    })(
                        <Input 
                        placeholder="请输入用户名..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='密 码'>
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '请输入密码...' },
                            {min:6,message: '密码太短了...'},
                            {max:20,message: '密码太长了...'},
                        ],
                    })(
                        <Input.Password  
                        placeholder="请输入密码..."
                        size='large'
                        type="password"
                        />,
                    )}
                </Form.Item>
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
                        rules: [{ required: true, message: '请输入手机号...' }],
                    })(
                        <Input 
                        placeholder="请输入手机号..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                </Form>
        </div>
    )
}
const AdminForm = Form.create({ name: 'adimin_form' })(SubmitForm);
export default AdminForm
