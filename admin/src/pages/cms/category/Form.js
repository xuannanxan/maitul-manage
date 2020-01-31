import React, { useState ,useImperativeHandle} from 'react';
import { Input ,Form ,InputNumber,TreeSelect,Select,message} from 'antd';
import {_cmsCategoryAdd,_cmsCategoryEdit} from '../../../utils/api'
const {TextArea} = Input

function SubmitForm(props){
    let { form,params,dataTree,site,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    const [treeData,setTreeData] = useState([])
    const edit= (formData) => {
        _cmsCategoryEdit(formData,site).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        })
        
    }
    const add=(formData)=>{
        _cmsCategoryAdd(formData,site).then(res=>{
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
                    if(values.keywords&&values.keywords.length){
                        values.keywords = values.keywords.join(',')
                    }
                    if(params.id){
                        edit(values)
                    }else{
                        add(values)
                    }
                }
                });
        },
        init:()=>{
            let arr = initTreeData(dataTree)
            arr.unshift({ key: 0, value: 0, title: '顶级分类',children:[]})
            setTreeData(arr)
            if(params){
                form.setFieldsValue({
                    id:params.id,
                    pid:params.pid,
                    name:params.name,
                    icon:params.icon,
                    description:params.description,
                    keywords:params.keywords?params.keywords.split(','):[],
                    sort:params.sort?params.sort:1
                })
            }
            
        }
    }));
    
    const initTreeData = (data)=>{
        return data.map((v,k)=>{
            let children = []
            if (v.children.length>0){
                children=initTreeData(v.children)
                }
            return { key: v.id, value: v.id, title: v.name,children:children}
        })
    }
    
    return(
        <div>
            <Form className="content-form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='上级分类'>
                    {getFieldDecorator('pid', {
                        rules: [{ required: true, message: '请选择上级分类!' }],
                    })(
                        <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            key='id'
                            treeData={treeData}
                            size="large"
                            placeholder="请选择上级分类"
                            treeDefaultExpandAll
                        />,
                    )}
                </Form.Item>
                <Form.Item label='图 标'>
                    {getFieldDecorator('icon', {
                    })(
                        <Input 
                        placeholder="请输入图标..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='分类名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入分类名称!' }],
                    })(
                        <Input 
                        placeholder="请输入分类名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='关键词'>
                    {getFieldDecorator('keywords', {
                        initialValue: [],
                    })(
                        <Select
                        mode="tags"
                        placeholder="请输入关键词..."
                        size='large' 
                        tokenSeparators={[',']}
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
const CategoryForm = Form.create({ name: 'category_form' })(SubmitForm);
export default CategoryForm
