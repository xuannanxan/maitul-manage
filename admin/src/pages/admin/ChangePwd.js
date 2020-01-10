/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-08 13:49:14
 * @LastEditTime : 2020-01-10 16:03:11
 * @LastEditors  : Xuannan
 */
import React, {useImperativeHandle} from 'react';
import { Input ,Form ,message} from 'antd';
import {_changeUserPwd} from '../../utils/api'

function ChangeUserPwdForm(props){
    let {cRef,form,handleCancel,refreshUser} = props
    const { getFieldDecorator } = form; //表单内容
    useImperativeHandle(cRef, () => ({
        changeUserPwd:()=>{
            form.validateFields((err, values) => {
                if (!err) {
                    if(values.new_password === values.password){
                        message.error('密码没变化呀...')
                    }else{
                        if (values.r_password===values.new_password){
                            _changeUserPwd(values).then(res=>{
                                if(res.data.status === 1403){
                                    message.success(res.data.msg)
                                    handleCancel()
                                    refreshUser()
                                }
                            }) 
                        }else{
                            message.error('重复密码与新密码不一致...')
                        }
                    }
                }
                });
        }
    }))
    return(
        <div>
        <Form className="content-form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item label='原密码'>
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '请输入原密码...' },
                            {min:6,message: '密码太短了...'},
                            {max:20,message: '密码太长了...'},
                        ],
                    })(
                        <Input.Password  
                        placeholder="请输入原密码..."
                        size='large'
                        type="password"
                        />,
                    )}
                </Form.Item>
                <Form.Item label='新密码'>
                    {getFieldDecorator('new_password', {
                        rules: [
                            { required: true, message: '请输入新密码...' },
                            {min:6,message: '密码太短了...'},
                            {max:20,message: '密码太长了...'},
                    ],
                    })(
                        <Input.Password  
                        placeholder="请输入新密码..."
                        size='large'
                        type="password"
                        />,
                    )}
                </Form.Item>
                <Form.Item label='重复新密码'>
                    {getFieldDecorator('r_password', {
                        rules: [
                            { required: true, message: '请再次输入新密码...' },
                            {min:6,message: '密码太短了...'},
                            {max:20,message: '密码太长了...'},
                        ],
                    })(
                        <Input.Password 
                        placeholder="请再次输入新密码..."
                        size='large'
                        type="password"
                        />,
                    )}
                </Form.Item>
                </Form>
        </div>
    )
}
const ChangeUserPwd = Form.create({name:'user_pwd_form'})(ChangeUserPwdForm)
export default ChangeUserPwd