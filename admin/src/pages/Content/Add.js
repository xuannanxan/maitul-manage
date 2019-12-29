/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-14 17:40:02
 * @LastEditTime : 2019-12-28 21:07:49
 * @LastEditors  : Xuannan
 */

import React, { useState} from 'react';
import marked from 'marked'
import { Row, Col, Input, Icon ,Select,Form ,Spin,Button,InputNumber,TreeSelect} from 'antd';
import '../../static/css/content/add.css'
import Editor from '../components/Editor'

const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1',
          key: '0-0-1',
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
    },
  ];


const { Option } = Select;
const { TextArea } = Input
marked.setOptions({
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  }); 
function AddForm(props){
    const [markdownContent, setMarkdownContent] = useState('内容预览...') //html内容
    const { getFieldDecorator } = props.form; //表单内容
    const [isLoading, setIsLoading] = useState(false)
    const submitFormData = (e)=>{
        e.preventDefault();
        props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
        }
        });
        setIsLoading(true)
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
        treeData={treeData}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="选择分类"
        allowClear
        treeDefaultExpandAll
        size='large'
      ></TreeSelect>,
      );
  
    const changeContent = (e)=>{
        let html=marked(e.target.value)
        setMarkdownContent(html)
    }
    
    return (
        <div>
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
                                        <Button type="primary" htmlType="submit" size='large'>
                                            发 布
                                        </Button>
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
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Spin>
            
        </div>
        
    )
}
const AddContent = Form.create({ name: 'add_content' })(AddForm);
export default AddContent