import React, { useState ,useImperativeHandle} from 'react';
import { Input ,Form ,Select,InputNumber,message} from 'antd';
import {_configAdd,_configEdit} from '../../utils/api'
const { Option } = Select;

function SubmitForm(props){
    let { form,params,menuOption ,handleCancel} = props
    const [fieldType,setFieldType] = useState('')
    const [selectValue,setSelectValue] = useState([])
    const { getFieldDecorator } = form; //表单内容
    
    const edit= (formData) => {
        _configEdit(formData).then(res=>{
            if(res.data.status === 200){
                message.success(res.data.msg)
                handleCancel()
            }
        }) 
    }
    const add=(formData)=>{
        _configAdd(formData).then(res=>{
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
                    if(values.values&&values.values.length){
                        values.values = values.values.join(',')
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
            if(params.moduleID){
                form.setFieldsValue({
                    id:params.id,
                    moduleID:params.moduleID,
                    name:params.name,
                    ename:params.ename,
                    fieldType:params.fieldType,
                    placeholder:params.placeholder,
                    value:params.value,
                })
                setFieldType(params.fieldType)
                if(params.values){
                    form.setFieldsValue({
                        values:params.values.split(',')
                    })
                    setSelectValue(params.values.split(','))
                }
                if(params.sort){
                    form.setFieldsValue({
                        sort:params.sort,
                    })
                }
            }  
        }
    }));

    return(
        <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item  {...getFieldDecorator('id')}/>
                <Form.Item label='所属模块'>
                    {getFieldDecorator('moduleID', {
                        rules: [{ required: true, message: '请选择所属模块..' }],
                    })(
                        <Select
                            placeholder="请选择所属模块..."
                            size='large'
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                        >
                        {menuOption && menuOption.length? 
                        menuOption.map((item,index)=>{
                            return(
                                <Option key={item.id}>{item.name}</Option>
                            )
                        }):''}
                        </Select>,
                    )}
                </Form.Item>
                
                <Form.Item label='配置项名称'>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入配置项名称!' }],
                    })(
                        <Input 
                        placeholder="请输入配置项名称..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='调用名'>
                    {getFieldDecorator('ename', {
                        rules: [{ required: true, message: '请输入调用名' }],
                    })(
                        <Input 
                        placeholder="请输入调用名..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                <Form.Item label='表单类型'>
                    {getFieldDecorator('fieldType', {
                        rules: [{ required: true, message: '请选择表单类型..' }],
                    })(
                        <Select
                            placeholder="请选择表单类型..."
                            size='large'
                            onChange={(value)=>{setFieldType(value)}}
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                        >
                        <Option key='Input'>文本框</Option>
                        <Option key='Number'>数字输入框</Option>
                        <Option key='Textarea'>文本域</Option>
                        <Option key='Select'>选择器</Option>
                        <Option key='Checkbox'>多选框</Option>
                        <Option key='Editor'>富文本编辑器</Option>
                        <Option key='ImgUpload'>单图上传</Option>
                        </Select>,
                    )}
                </Form.Item>
                {(['Switch','Select','Checkbox'].indexOf(fieldType)>-1)?
                <div>
                <Form.Item label='可选值'>
                    {getFieldDecorator('values', {
                        initialValue: [],
                    })(
                        <Select
                        mode="tags"
                        placeholder="请输入可选值..."
                        size='large' 
                        onChange={(value)=>{setSelectValue(value)}}
                        tokenSeparators={[',']}
                        />,
                    )}
                </Form.Item>
                <Form.Item label='默认值'>
                    {getFieldDecorator('value', {
                    })(
                        <Select
                        placeholder="请选择默认值..."
                        size='large' 
                        >
                        {selectValue && selectValue.length? 
                            selectValue.map((item,index)=>{
                                return(
                                    <Option key={item}>{item}</Option>
                                )
                            }):''}
                        </Select>,
                    )}
                </Form.Item></div>:
                <Form.Item label='默认值' key='value_key'>
                    {getFieldDecorator('value', {
                    })(
                        <Input 
                        placeholder="请输入默认值..."
                        size='large'
                        />,
                    )}
                </Form.Item>
                }      
                
                <Form.Item label='提示信息' key='placeholder_key'>
                    {getFieldDecorator('placeholder', {
                    })(
                        <Input 
                        placeholder="请输入提示信息..."
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
const ConfForm = Form.create({ name: 'config_form' })(SubmitForm);
export default ConfForm
