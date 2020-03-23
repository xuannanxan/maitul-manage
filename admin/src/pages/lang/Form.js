/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-27 21:27:29
 * @LastEditTime: 2020-03-23 14:28:17
 * @LastEditors: Xuannan
 */
import React, {useImperativeHandle} from 'react';
import { Input ,Form ,InputNumber,message} from 'antd';
import {_langAdd,_langEdit} from '../../utils/api'


function SubmitForm(props){
    let { form,params,site ,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    

    const edit= (formData) => {
        _langEdit(formData,site).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        })
        
    }
    const add=(formData)=>{
        _langAdd(formData,site).then(res=>{
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
                    ename:params.ename,
                    sort:params.sort?params.sort:1,
                })
            }
        }
    }));

    return(
        <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='语言名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入语言名称...' }],
                    })(
                        <Input 
                        placeholder="请输入语言名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='调用名称'>
                    {getFieldDecorator('ename', {
                        rules: [{ required: true, message: '请输入调用名称...' }],
                    })(
                        <Input 
                        placeholder="请输入调用名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='排序号'>
                    {getFieldDecorator('sort', {
                        initialValue:1 ,
                    })(
                        <InputNumber 
                        min={1} 
                        max={9999} 
                        size='large'
                        />,
                    )}
                </Form.Item>
                </Form>
        </div>
    )
}
const LangForm = Form.create({ name: 'lang_form' })(SubmitForm);
export default LangForm
