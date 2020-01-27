/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-27 21:27:29
 * @LastEditTime : 2020-01-27 21:49:30
 * @LastEditors  : Xuannan
 */
import React, {useImperativeHandle} from 'react';
import { Input ,Form ,InputNumber,message} from 'antd';
import {_blogTagAdd,_blogTagEdit} from '../../../utils/api'


function SubmitForm(props){
    let { form,params ,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    

    const edit= (formData) => {
        _blogTagEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        })
        
    }
    const add=(formData)=>{
        _blogTagAdd(formData).then(res=>{
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
                    sort:params.sort,
                })
            }
        }
    }));

    return(
        <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='标签名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入标签名称!' }],
                    })(
                        <Input 
                        placeholder="请输入标签名称..."
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
const BlogTagForm = Form.create({ name: 'blog_tag_form' })(SubmitForm);
export default BlogTagForm
