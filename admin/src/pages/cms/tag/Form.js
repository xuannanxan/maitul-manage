/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-27 21:27:29
 * @LastEditTime: 2020-03-24 13:40:18
 * @LastEditors: Xuannan
 */
import React, {useImperativeHandle} from 'react';
import { Input ,Form ,InputNumber,message,Select} from 'antd';
import {_cmsTagAdd,_cmsTagEdit} from '../../../utils/api'
const { Option } = Select;

function SubmitForm(props){
    let { form,params,site ,handleCancel,langList} = props
    const { getFieldDecorator } = form; //表单内容
    

    const edit= (formData) => {
        _cmsTagEdit(formData,site).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        })
        
    }
    const add=(formData)=>{
        _cmsTagAdd(formData,site).then(res=>{
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
                    lang:params.lang,
                    sort:params.sort?params.sort:1,
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
                <Form.Item label='语言类型'>
                    {getFieldDecorator('lang', {
                    })(
                        <Select
                            placeholder="请选择语言类型..."
                            size='large'
                        >
                        <Option key="common">通用</Option>
                        {langList && langList.length? 
                            langList.map((item,index)=>{
                            return(
                                <Option key={item.ename}>{item.name}</Option>
                            )
                        }):''}
                        </Select>,
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
const TagForm = Form.create({ name: 'tag_form' })(SubmitForm);
export default TagForm
