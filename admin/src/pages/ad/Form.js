/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-17 10:30:37
 * @LastEditTime : 2020-01-17 14:35:53
 * @LastEditors  : Xuannan
 */
import React, { useState ,useImperativeHandle} from 'react';
import { Input ,Select, Form ,Button,Icon,Upload,InputNumber,message} from 'antd';
import {_adAdd,_adEdit,_fileUpload} from '../../utils/api'
const {TextArea} = Input 
const {Option} = Select 
function SubmitForm(props){
    let { form,params ,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
 

    const edit= (formData) => {
        _adEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        })
        
    }
    const add=(formData)=>{
        _adAdd(formData).then(res=>{
            if(res.data.status === 201){
                message.success(res.data.msg)
                handleCancel()
             
            }
        })
    }

    const uploadImg = (e)=>{
        let formData=new FormData();
        formData.append('file',e.file)
        _fileUpload(formData).then(res=>{
            console.log(res.data)
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
                    space_id:params.space_id,
                    name:params.name,
                    info:params.info,
                    url:params.url,
                    sort:params.sort
                })
            }
        }
    }));
    
   
    
    return(
        <div>
            <Form className="content-form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label="所属广告位" hasFeedback>
                {getFieldDecorator('space_id', {
                    rules: [{ required: true, message: '请选择所属广告位...' }],
                })(
                    <Select placeholder="请选择所属广告位...">
                    <Option value="china">China</Option>
                    <Option value="usa">U.S.A</Option>
                    </Select>,
                )}
                </Form.Item>
                <Form.Item label='广告名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入广告名称!' }],
                    })(
                        <Input 
                        placeholder="请输入广告名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='广告链接'>
                    {getFieldDecorator('url', {
                    })(
                        <Input 
                        placeholder="请输入广告链接..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label="广告图片" extra="请上传图片...">
                    {getFieldDecorator('img', {
                        valuePropName: 'fileList',
                    })(
                        <Upload name="file" listType="picture" customRequest={uploadImg}>
                        <Button>
                            <Icon type="upload" /> Click to upload
                        </Button>
                        </Upload>,
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
const AdForm = Form.create({ name: 'ad_form' })(SubmitForm);
export default AdForm
