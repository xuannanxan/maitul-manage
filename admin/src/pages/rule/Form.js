import React, { useState ,useImperativeHandle} from 'react';
import { Input ,Form ,Select,TreeSelect,message} from 'antd';
import {_ruleAdd,_ruleEdit} from '../../utils/api'
const { Option } = Select;

function SubmitForm(props){
    let { form,params,menuOption ,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    const [treeData,setTreeData] = useState([])

    const edit= (formData) => {
        _ruleEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        })
        
    }
    const add=(formData)=>{
        _ruleAdd(formData).then(res=>{
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
                    menu_id:params.menu_id,
                    name:params.name,
                    method:params.method,
                    url:params.url,
                })
            }
            setTreeData(menuOption)
        }
    }));

    return(
        <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='所属菜单'>
                    {getFieldDecorator('menu_id', {
                        rules: [{ required: true, message: '请选择所属菜单!' }],
                    })(
                        <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            key='id'
                            treeData={treeData}
                            size="large"
                            placeholder="请选择上级菜单"
                            treeDefaultExpandAll
                        />,
                    )}
                </Form.Item>
                
                <Form.Item label='权限规则名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入权限规则名称!' }],
                    })(
                        <Input 
                        placeholder="请输入权限规则名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='URL'>
                    {getFieldDecorator('url', {
                        rules: [{ required: true, message: '请输入url!' }],
                    })(
                        <Input 
                        placeholder="请输入权限规则URL..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='请求方法'>
                    {getFieldDecorator('method', {
                        rules: [{ required: true, message: '请选择请求方法!' }],
                    })(
                        <Select
                            placeholder="请选择请求方法..."
                            size='large'
                        >
                            <Option value="GET">GET</Option>
                            <Option value="POST">POST</Option>
                            <Option value="PUT">PUT</Option>
                            <Option value="DELETE">DELETE</Option>
                        </Select>,
                    )}
                </Form.Item>
                </Form>
        </div>
    )
}
const RuleForm = Form.create({ name: 'rule_form' })(SubmitForm);
export default RuleForm
