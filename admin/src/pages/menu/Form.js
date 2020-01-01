import React, { useState ,useEffect,useImperativeHandle} from 'react';
import { Row, Col, Input, Icon ,Select,Form ,Button,InputNumber,TreeSelect} from 'antd';
const { Option } = Select;
const { TextArea } = Input
function SubmitForm(props){
    const { getFieldDecorator } = props.form; //表单内容
    const [treeData,setTreeData] = useState([])
    const submitFormData = (e)=>{
        e.preventDefault();
        props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
        }
        });
       
    }

    const initForm = ()=>{
        props.form.setFieldsValue({
            pid:props.params.pid,
            name:props.params.name,
            icon:props.params.icon,
            url:props.params.url,
            sort:props.params.sort
        })
    }

    useImperativeHandle(props.cRef, () => ({
        // 暴露给父组件的方法
        edit: () => {
            if(props.params){
                console.log(props.params)
                props.form.setFieldsValue({
                    pid:props.params.pid,
                    name:props.params.name,
                    icon:props.params.icon,
                    url:props.params.url,
                    sort:props.params.sort
                })
            }
        },
        add:()=>{

        },
        init:()=>{
            let arr = initTreeData(props.menuTree)
            arr.unshift({ key: 0, value: 0, title: '顶级菜单',children:[]})
            setTreeData(arr)
            if(props.params){
                props.form.setFieldsValue({
                    pid:props.params.pid,
                    name:props.params.name,
                    icon:props.params.icon,
                    url:props.params.url,
                    sort:props.params.sort
                })
            }
        }
    }));
    
    const initTreeData = (data)=>{
        let arr = []
        data.map((v, index) => {
            let children = []
            if (v.children.length>0){
                children=initTreeData(v.children)
            }
            arr.push({ key: v.id, value: v.id, title: v.name,children:children})
        })
        return arr
    }
    
    return(
        <div>
            <Form onSubmit={submitFormData} className="content-form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item label='上级菜单'>
                    {getFieldDecorator('pid', {
                        rules: [{ required: true, message: '请选择上级菜单!' }],
                    })(
                        <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            key='id'
                            treeData={treeData}
                            placeholder="Please select"
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
                <Form.Item label='菜单名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入菜单名称!' }],
                    })(
                        <Input 
                        placeholder="请输入菜单名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='URL'>
                    {getFieldDecorator('url', {
                    })(
                        <Input 
                        placeholder="请输入菜单URL..."
                        size='large'
                        />,
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
                </Form>
        </div>
    )
}
const MenuForm = Form.create({ name: 'menu_form' })(SubmitForm);
export default MenuForm
