/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-14 17:40:02
 * @LastEditTime: 2020-03-07 01:10:04
 * @LastEditors: Xuannan
 */


import React, { useState,useImperativeHandle} from 'react';
import {_cmsContentEdit,_cmsContentAdd,_fileUpload} from '../../../utils/api'
import { Row, Col, Input ,Icon ,Select,Form ,Upload ,Spin,Button,InputNumber,TreeSelect ,message} from 'antd';
import Editor from '../../components/Editor'


const { Option } = Select;
const { TextArea } = Input
function SubmitForm(props){
    const [imageUrl ,setImageUrl ] = useState('')
    const [loading ,setLoading ] = useState(false)
    const {form,params,tagList,dataOption,site,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    const [isLoading, setIsLoading] = useState(false)
    const edit= (formData) => {
        _cmsContentEdit(formData,site).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                setTimeout(()=>{
                    handleCancel(formData.category_id)
                },1000)
            }
        })
        
    }
    const add=(formData)=>{
        _cmsContentAdd(formData,site).then(res=>{
            if(res.data.status === 201){
                message.success(res.data.msg)
                setTimeout(()=>{
                    handleCancel(formData.category_id)
                },1000)
                
            }
        })
    }
    const uploadButton = (
        <div>
          <Icon type={loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">点击上传</div>
        </div>
      );
    const uploadImg = (e)=>{
        setLoading(true)
        let formData=new FormData();
        formData.append('file',e.file)
        _fileUpload(formData).then(res=>{
            if (res.data.status===200){
                setImageUrl(res.data.path)
                form.setFieldsValue({
                    cover:res.data.path,
                })
            }
        })
        setLoading(false)
    }
    
    const beforeUpload=(file)=>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只能上传JPG/PNG文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片不能超过2MB!');
        }
        return isJpgOrPng && isLt2M;
      } 
    const submitFormData = (e)=>{
        setIsLoading(true)
        e.preventDefault();
        props.form.validateFields((err, values) => {
        if (!err) {
            if(values.tags&&values.tags.length){
                values.tags = values.tags.join(',')
            }
            if(values.keywords&&values.keywords.length){
                values.keywords = values.keywords.join(',')
            }
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
    const checkCategory = (rule, value, callback) => {
        if (value) {
          callback();
          return;
        }
        message.error('请选择分类...');
        callback('请选择分类...');
      }
    const categorySelector = getFieldDecorator('category_id', {
        rules: [{ required: true, validator: checkCategory }],
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
                    content:params.content,
                    tags:params.tags?params.tags.split(','):[],
                    keywords:params.keywords?params.keywords.split(','):[],
                    description:params.description,
                    sort:params.sort?params.sort:1,
                })
                if(params.category_id){
                    form.setFieldsValue({
                        category_id:params.category_id?params.category_id:'',
                    })
                }
                setImageUrl(params.cover?params.cover:'')
            }
        }
    }));
       
    
    return (
            <Spin tip="Loading..." spinning={isLoading}>
                <Form onSubmit={submitFormData} className="content-form" labelCol={{ span:4 }} wrapperCol={{ span: 20 }}>
                    <Row gutter={5}>
                        <Col span={16}>
                            <Form.Item hasFeedback  wrapperCol={{ span:24 }}>
                            {getFieldDecorator('title', {
                                rules: [
                                    { required: true, message: '请输入标题!' }, 
                                    {max:50,message: '标题不能大于50个字符',
                                  }],
                            })(
                                <Input
                                addonBefore={categorySelector}
                                placeholder="请输入标题..."
                                size='large'
                                />,
                            )}
                            </Form.Item>
                            <Row>
                                <Form.Item hasFeedback  wrapperCol={{ span:24 }}>
                                {getFieldDecorator('content', {
                                     rules: [{ required: true, message: '请输入内容!' }],
                                })(
                                    <Editor/>,
                                )}
                                </Form.Item>
                            </Row>
                        </Col>
                        <Col span={8}>
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
                                    <Form.Item label="封  面">
                                        {getFieldDecorator('cover', {
                                            initialValue: imageUrl,
                                            valuePropName:'file',
                                        })(
                                            <Upload
                                                name="file"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                customRequest={uploadImg} 
                                                beforeUpload={beforeUpload}
                                            >
                                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                            </Upload>,
                                        )}
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
                                    <Form.Item label='标  签'>
                                    {getFieldDecorator('tags', {
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择标签"
                                            size='large'
                                        >
                                            {tagList.map(item=>{
                                                return(
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                            })}
                                        </Select>,
                                    )}
                                    </Form.Item>
                                    <Form.Item label='关键词'>
                                    {getFieldDecorator('keywords', {
                                    })(
                                        <Select
                                            mode="tags"
                                            placeholder="请选择标签"
                                            size='large'
                                        >
                                            {tagList.map(item=>{
                                                return(
                                                    <Option key={item.id} value={item.name}>{item.name}</Option>
                                                )
                                            })}
                                        </Select>,
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