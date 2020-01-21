/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-21 11:59:51
 * @LastEditTime : 2020-01-21 17:26:45
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useRef} from 'react';
import {_menuTree,_configList,_fileUpload} from '../../utils/api'
import Editor from '../components/Editor'
import {Select,InputNumber,Input,Form ,Tabs ,Divider ,Switch,Upload,Checkbox,Icon ,Menu ,Button ,Modal,message,Col,Row,Spin} from 'antd';
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const WebConfigForm = (props)=>{
    let { form} = props
    const { getFieldDecorator } = form; //表单内容
    const [isLoading,setIsLoading] = useState(false)
    const [loading,setLoading] = useState(false)
    const [menuTree,setMenuTree] = useState([])
    const [confList,setConfList] = useState([])
    const [activeTab,setActiveTab] = useState('')
    const [showImg,setShowImg] = useState({})
    const initData = ()=>{
        _menuTree().then(res=>{
            setMenuTree(res.data.data)
            setActiveTab(res.data.data[0].id)
        })
        _configList().then(res=>{
          setConfList(res.data.data)
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
                const obj = {}
                obj[e.filename] = res.data.path
                form.setFieldsValue(obj)
                const tempShowImg = showImg
                tempShowImg[e.filename] = res.data.path
                setShowImg(tempShowImg)
            }
        })
        setLoading(false)
    }
    useEffect(()=>{
    initData()
    },[])
    return(
        <div className='main-content'>
            {menuTree && menuTree.length?
                <Tabs defaultActiveKey={activeTab} onChange={(key)=>{setActiveTab(key)}}>
                {menuTree.map(item=>{
                    return (
                        <TabPane tab={item.name} key={item.id}>
                       { confList[item.id] && confList[item.id].length?
                            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                            {confList[item.id].map(conf=>{
                                switch (conf.fieldType) {
                                    // <Option key='Input'>文本框</Option>
                                    // <Option key='Number'>数字输入框</Option>
                                    // <Option key='Textarea'>文本域</Option>
                                    // <Option key='Switch'>开关</Option>
                                    // <Option key='Select'>选择器</Option>
                                    // <Option key='Checkbox'>多选框</Option>
                                    // <Option key='Editor'>富文本编辑器</Option>
                                    // <Option key='ImgUpload'>单图上传</Option>
                                    // <Option key='Upload'>多文件上传</Option>
                                    case 'Input':
                                        return(
                                            <Form.Item label={conf.name} key={conf.id}>
                                                {getFieldDecorator(conf.ename, {
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
                                            <Form.Item label={conf.name} key={conf.id}>
                                                {getFieldDecorator(conf.ename, {
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
                                            <Form.Item label={conf.name} key={conf.id}>
                                                {getFieldDecorator(conf.ename, {
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
                                            <Form.Item label={conf.name} key={conf.id}>
                                                {getFieldDecorator(conf.ename, {
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
                                            <Form.Item label={conf.name} key={conf.id}>
                                                {getFieldDecorator(conf.ename, {
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
                                            <Form.Item label={conf.name} key={conf.id}>
                                                {getFieldDecorator(conf.ename, {
                                                    initialValue:conf.value,
                                                })(
                                                    <Editor/>,
                                                )}
                                            </Form.Item>    
                                        );
                                    case 'ImgUpload':
                                        
                                        return(
                                            <Form.Item label={conf.name} key={conf.id}>
                                                {getFieldDecorator(conf.ename, {
                                                    initialValue:conf.value,
                                                })(
                                                    <Upload
                                                        name={conf.ename}
                                                        listType="picture-card"
                                                        className="avatar-uploader"
                                                        showUploadList={false}
                                                        customRequest={uploadImg} 
                                                    >
                                                        {  showImg[conf.ename] ? <img src={showImg[conf.ename]} alt={conf.name} style={{ width: '100%' }} /> : uploadButton}
                                                    </Upload>,
                                                )}
                                            </Form.Item>    
                                        );
                                
                                } 

                            })}
                            </Form>: '暂无数据' }
                        </TabPane>
                    )
                })}
                </Tabs>
            : '暂无数据' }  
        </div>
    )
}
const WebConfig = Form.create({ name: 'web_config_form' })(WebConfigForm);
export default WebConfig