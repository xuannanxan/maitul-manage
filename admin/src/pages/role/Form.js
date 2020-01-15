/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-13 14:33:08
 * @LastEditTime : 2020-01-15 18:41:00
 * @LastEditors  : Xuannan
 */
import React, { useImperativeHandle} from 'react';
import { Input ,Form,message} from 'antd';
import {_roleAdd,_roleEdit} from '../../utils/api'
const { TextArea } = Input

function SubmitForm(props){
    let { form,params,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    

    const edit= (formData) => {
        _roleEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        })
        
    }
    const add=(formData)=>{
        _roleAdd(formData).then(res=>{
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
                    if(params.id){
                        edit(values)
                    }else{
                        add(values)
                    }
                }
                });
        },
        init:()=>{
            if(params){
                form.setFieldsValue({
                    id:params.id,
                    name:params.name,
                    info:params.info,
                })
            }
        }
    }));
    

    return(
        <div>
            <Form  labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='角色名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入角色名称...' }],
                    })(
                        <Input 
                        placeholder="请输入角色名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='描  述'>
                {getFieldDecorator('info', {
                })(
                    <TextArea 
                    rows={3}
                    placeholder="请输入描述..."
                    />,
                )}
                </Form.Item>
                </Form>
        </div>
    )
}
const RoleForm = Form.create({ name: 'role_form' })(SubmitForm);
export default RoleForm
