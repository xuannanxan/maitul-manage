import React, { useState ,useImperativeHandle} from 'react';
import { Input ,Form ,InputNumber,TreeSelect,message} from 'antd';
import {_menuAdd,_menuEdit} from '../../utils/api'

function SubmitForm(props){
    let { form,params,menuTree ,handleCancel,refreshMenu} = props
    const { getFieldDecorator } = form; //表单内容
    const [treeData,setTreeData] = useState([])

    const edit= (formData) => {
        _menuEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
                refreshMenu()
            }
        })
        
    }
    const add=(formData)=>{
        _menuAdd(formData).then(res=>{
            if(res.data.status === 201){
                message.success(res.data.msg)
                handleCancel()
                refreshMenu()
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
            let arr = initTreeData(menuTree)
            arr.unshift({ key: 0, value: 0, title: '顶级菜单',children:[]})
            setTreeData(arr)
            if(params){
                props.form.setFieldsValue({
                    id:params.id,
                    pid:params.pid,
                    name:params.name,
                    icon:params.icon,
                    url:params.url,
                    sort:params.sort
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
            <Form className="content-form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='上级菜单'>
                    {getFieldDecorator('pid', {
                        rules: [{ required: true, message: '请选择上级菜单!' }],
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
const MenuForm = Form.create({ name: 'menu_form' })(SubmitForm);
export default MenuForm
