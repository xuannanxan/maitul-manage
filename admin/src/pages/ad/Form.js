/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-17 10:30:37
 * @LastEditTime : 2020-01-19 14:03:16
 * @LastEditors  : Xuannan
 */
import React, { useState ,useImperativeHandle} from 'react';
import { Input ,Select, Form ,Icon,Upload,InputNumber,message} from 'antd';
import {_adAdd,_adEdit,_fileUpload} from '../../utils/api'
const {TextArea} = Input 
const {Option} = Select 
function SubmitForm(props){
    let { form,params,adSpaceList ,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    const [imageUrl ,setImageUrl ] = useState('')
    const [loading ,setLoading ] = useState(false)
    const [spaceList ,setSpaceList ] = useState([])
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
                    img:res.data.path,
                })
            }
        })
        setLoading(false)
    }
    const checkImg = (rule, value, callback) => {
        if (value.length) {
          callback();
          return;
        }
        callback('请添加广告图片...');
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
                    img:params.img,
                    sort:params.sort
                })
                setImageUrl(params.img)
            }
            if(adSpaceList){
                setSpaceList(adSpaceList.map((item,index)=>{
                    return(<Option key={item.id}>{item.name}</Option>)
                }))
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
                    <Select placeholder="请选择所属广告位..." size='large'>
                        {spaceList}
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
                <Form.Item label="广告图片">
                    {getFieldDecorator('img', {
                        initialValue: imageUrl,
                        valuePropName:'file',
                        rules: [{ required: true,validator: checkImg }],
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
