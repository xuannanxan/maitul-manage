/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-14 17:40:02
 * @LastEditTime : 2020-01-29 23:15:32
 * @LastEditors  : Xuannan
 */


import React, { useState,useImperativeHandle} from 'react';
import {_blogContentEdit,_blogContentAdd} from '../../../utils/api'
import { Row, Col, Input ,Select,Form ,Spin,Button,InputNumber,TreeSelect ,message} from 'antd';
import '../../../static/css/blog/content/add.css'
import Editor from '../../components/Editor'


const { Option } = Select;
const { TextArea } = Input
function SubmitForm(props){
    const {form,params,dataOption,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    const [isLoading, setIsLoading] = useState(false)
    const edit= (formData) => {
        _blogContentEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                setTimeout(()=>{
                    handleCancel(formData.category_id)
                },1000)
            }
        })
        
    }
    const add=(formData)=>{
        _blogContentAdd(formData).then(res=>{
            if(res.data.status === 201){
                message.success(res.data.msg)
                setTimeout(()=>{
                    handleCancel(formData.category_id)
                },1000)
                
            }
        })
    }
    const submitFormData = (e)=>{
        setIsLoading(true)
        e.preventDefault();
        props.form.validateFields((err, values) => {
        if (!err) {
            if(params.id){
                edit(values);
            }else{
                add(values);
            }
            
        }
        });
        setTimeout(()=>{
            setIsLoading(false)
        },1000)
    }
    const categorySelector = getFieldDecorator('category_id', {
        rules: [{ required: true, message: '请选择分类!' }],
      })(
        <TreeSelect
        showSearch
        style={{ width: '200px' }}
        treeData={dataOption}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="选择分类"
        allowClear
        treeDefaultExpandAll
        size='large'
      ></TreeSelect>,
      );
    useImperativeHandle(props.cRef, () => ({
        // 暴露给父组件的方法
        init:()=>{
            if(params){
                form.setFieldsValue({
                    id:params.id,
                    title:params.title,
                    tags:params.tags,
                    content:params.content,
                    category_id:params.category_id,
                    keywords:params.keywords,
                    description:params.description,
                    sort:params.sort
                })
            }
        }
    }));
       
    
    return (
            <Spin tip="Loading..." spinning={isLoading}>
                <Form onSubmit={submitFormData} className="content-form">
                    <Row gutter={5}>
                        <Col span={18}>
                            <Form.Item hasFeedback>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '请输入标题!' }],
                            })(
                                <Input
                                addonBefore={categorySelector}
                                placeholder="请输入标题..."
                                size='large'
                                />,
                            )}
                            </Form.Item>
                            <Row>
                                <Form.Item hasFeedback>
                                {getFieldDecorator('content', {
                                     rules: [{ required: true, message: '请输入内容!' }],
                                })(
                                    <Editor/>,
                                )}
                                </Form.Item>
                            </Row>
                            
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={24}>
                                    <Form.Item>
                                        <div>
                                        <Button type="primary" htmlType="submit" size='large'>
                                            发 布
                                        </Button>
                                        <Button size="large" onClick={()=>{handleCancel('')}}> 取 消</Button>
                                        </div>
                                    </Form.Item>
                                    <Form.Item label='排序号'>
                                    {getFieldDecorator('sort', {
                                        initialValue: 1 ,
                                    })(
                                        <InputNumber 
                                        min={1} 
                                        max={9999} 
                                        size='large'
                                        />,
                                    )}
                                    </Form.Item>
                                    <Form.Item label='标 签'>
                                    {getFieldDecorator('tags', {
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择标签"
                                            size='large'
                                        >
                                            <Option value="1">1212</Option>
                                            <Option value="2">12.S.A</Option>
                                        </Select>,
                                    )}
                                    </Form.Item>
                                    <Form.Item label='关键词'>
                                    {getFieldDecorator('keywords', {
                                    })(
                                        <Input 
                                        placeholder="请输入关键词..."
                                        size='large'
                                        />,
                                    )}
                                    </Form.Item>
                                    <Form.Item label='描  述'>
                                    {getFieldDecorator('description', {
                                    })(
                                        <TextArea 
                                        rows={3}
                                        className="markdown-content"   
                                        placeholder="请输入描述..."
                                        />,
                                    )}
                                    </Form.Item>
                                    <Form.Item  {...getFieldDecorator('id')}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Spin>  
    )
}
const ContentForm = Form.create({ name: 'content_form' })(SubmitForm);
export default ContentForm