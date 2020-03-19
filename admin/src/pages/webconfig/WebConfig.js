/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-22 19:25:04
 * @LastEditTime: 2020-03-19 13:46:18
 * @LastEditors: Xuannan
 */

import React, { useState,useEffect  } from 'react';
import {_configList,_fileUpload,_webconfigEdit} from '../../utils/api'
import Editor from '../components/Editor'
import {Select,InputNumber,Input,Form  ,Upload,Checkbox,Icon  ,Button ,message,Col,Row,Spin} from 'antd';
const { Option } = Select;
const { TextArea } = Input;
const WebConfigForm = (props)=>{
    let { form} = props
    const { getFieldDecorator } = form; //表单内容
    const [isLoading,setIsLoading] = useState(false)
    const [loading,setLoading] = useState(false)
    const [confList,setConfList] = useState([])
    const [site,setSite] = useState(props.match.params.site)
    const [imgObj,setImgObj] = useState({})
    const uploadImg = (e)=>{
        if(e.file){
            setLoading(true)
            let formData=new FormData();
            formData.append('file',e.file)
            _fileUpload(formData).then(res=>{
                if (res.data.status===200){
                    const obj = {...imgObj}
                    obj[e.filename] = res.data.path
                    setImgObj(obj)
                    form.setFieldsValue(obj)
                }
            })
            setLoading(false)
        }else{
            message.error('请上传文件!');
        }
    } 
    const initData = ()=>{
        setIsLoading(true)
        _configList().then(res=>{
            const obj = {}
            for (var i in res.data.data) {
                res.data.data[i].forEach(item=>{
                    if(item.fieldType === 'ImgUpload'){
                        obj[item.site+'|'+item.ename] = item.value
                    }
                })
            }
            setImgObj(obj)
            setConfList(res.data.data)
        })
        setTimeout(()=>{
            setIsLoading(false)
          },300)
      }
    const uploadButton = (
    <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
    </div>
    );
    const submitFormData = ()=>{
        setIsLoading(true)
        form.validateFields((err, values) => {
            if (!err) {
                _webconfigEdit({data:values}).then(res=>{
                    if(res.data.status===200){
                        message.success(res.data.msg)
                        initData()
                      }
                })
            }
        });
        setTimeout(()=>{
            setIsLoading(false)
          },300)
    }
    const beforeUpload=(file)=>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只能上传JPG/PNG文件!');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          message.error('图片不能超过1MB!');
        }
        return isJpgOrPng && isLt1M;
      }  
    useEffect(()=>{
        initData()
        setSite(props.match.params.site)
    },[props.match.params.site])
    return(
        <div className='main-content'>
            <Spin tip="Loading..." spinning={isLoading}>
            { confList[site] && confList[site].length?
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            {confList[site].map(conf=>{
                switch (conf.fieldType) {
                    case 'Input':
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value,
                                })(
                                    <Input
                                    placeholder={conf.placeholder?conf.placeholder:'请输入...'}
                                    size='large'
                                    />,
                                )}
                            </Form.Item>    
                        );
                    case 'Number':
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value,
                                })(
                                    <InputNumber 
                                    placeholder={conf.placeholder?conf.placeholder:'请输入...'}
                                    size='large'
                                    />,
                                )}
                            </Form.Item>    
                        );
                    case 'Textarea':
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value,
                                })(
                                    <TextArea 
                                    rows={3}
                                    placeholder={conf.placeholder?conf.placeholder:'请输入...'}
                                    />,
                                )}
                            </Form.Item>    
                        );
                    case 'Select':
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value,
                                })(
                                    <Select size='large' placeholder={conf.placeholder?conf.placeholder:'请输入...'}>
                                        {
                                            conf.values.split(',').map(v=>{
                                                return (<Option key={conf.id+v} value={v}>{v}</Option>)
                                            })
                                        }
                                    </Select>,
                                )}
                            </Form.Item>    
                        );
                    case 'Checkbox':
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value.split(','),
                                })(
                                    <Checkbox.Group style={{ width: '100%' }}>
                                    <Row>
                                        {
                                            conf.values.split(',').map(v=>{
                                                return (
                                                    <Col key={conf.id+v} span={4}>
                                                    <Checkbox value={v}>{v}</Checkbox>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    </Checkbox.Group>,
                                )}
                            </Form.Item>    
                        );
                    case 'Editor':
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value,
                                })(
                                    <Editor/>,
                                )}
                            </Form.Item>    
                        );
                    case 'ImgUpload':
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value,
                                    valuePropName:'file',
                                })(
                                    <Upload
                                        name={conf.site+'|'+conf.ename}
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        customRequest={uploadImg}
                                        beforeUpload={beforeUpload} 
                                    >
                                        { imgObj[conf.site+'|'+conf.ename] ? <img src={imgObj[conf.site+'|'+conf.ename]} alt={conf.name} style={{ width: '100%' }} /> : uploadButton}
                                    </Upload>,
                                )}
                            </Form.Item>    
                        );
                    default:
                        return(
                            <Form.Item label={conf.name+`(${conf.ename})`} key={conf.id}>
                                {getFieldDecorator(conf.site+'|'+conf.ename, {
                                    initialValue:conf.value,
                                })(
                                    <Input
                                    placeholder={conf.placeholder?conf.placeholder:'请输入...'}
                                    size='large'
                                    />,
                                )}
                            </Form.Item>    
                        );
                } 

            })}
            <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
            <Button type="primary"  size='large' onClick={submitFormData}>
                保存
            </Button>
            </Form.Item>
            </Form>: '暂无数据' }
            </Spin>
        </div>
    )
}
const WebConfig = Form.create({ name: 'web_config_form' })(WebConfigForm);
export default WebConfig