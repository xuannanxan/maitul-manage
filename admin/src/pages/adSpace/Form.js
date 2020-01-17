/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-17 10:30:37
 * @LastEditTime : 2020-01-17 13:51:57
 * @LastEditors  : Xuannan
 */
import React, { useImperativeHandle} from 'react';
import { Input ,Form ,InputNumber,message} from 'antd';
import {_adSpaceAdd,_adSpaceEdit} from '../../utils/api'

function SubmitForm(props){
    let { form,params ,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
 

    const edit= (formData) => {
        _adSpaceEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
               
            }
        })
        
    }
    const add=(formData)=>{
        _adSpaceAdd(formData).then(res=>{
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
                    sort:params.sort
                })
            }
        }
    }));
    
   
    
    return(
        <div>
            <Form className="content-form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                
                <Form.Item label='广告位名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入广告位名称!' }],
                    })(
                        <Input 
                        placeholder="请输入广告位名称..."
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
const AdSpaceForm = Form.create({ name: 'ad_space_form' })(SubmitForm);
export default AdSpaceForm
