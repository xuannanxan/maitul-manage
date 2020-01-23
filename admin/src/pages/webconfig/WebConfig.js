/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-22 19:25:04
 * @LastEditTime : 2020-01-23 20:13:40
 * @LastEditors  : Xuannan
 */
/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-21 11:59:51
 * @LastEditTime : 2020-01-22 19:46:15
 * @LastEditors  : Xuannan
 */
import React, { useState,useEffect ,useReducer } from 'react';
import {_menuTree,_configList,_fileUpload,_webconfigEdit} from '../../utils/api'
import Editor from '../components/Editor'
import {Select,InputNumber,Input,Form ,Tabs ,Upload,Checkbox,Icon  ,Button ,message,Col,Row,Spin} from 'antd';
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
    const [imgObj, uploadImg] = useReducer((state, e) => {
        setLoading(true)
        let formData=new FormData();
        if(e.file){
            formData.append('file',e.file)
            _fileUpload(formData).then(res=>{
                if (res.data.status===200){
                    const obj = {}
                    state[e.filename] = res.data.path
                    obj[e.filename] = res.data.path
                    form.setFieldsValue(obj)
                }
            })
        }else{
            for (var i in e) {
                state[i] = e[i]
            }
        }
        setLoading(false)
        return state;
      }, {});

    const initData = ()=>{
        setIsLoading(true)
        let activeId = ''
        _menuTree().then(res=>{
            setMenuTree(res.data.data)
            activeId = res.data.data[0].id
            setActiveTab(activeId)
        })
        _configList().then(res=>{
          setConfList(res.data.data)
          for (var i in res.data.data) {
                if(res.data.data[i]){
                    res.data.data[i].forEach(item=>{
                        if(item.fieldType === 'ImgUpload'){
                            let obj = {}
                            obj[item.ename] = item.value
                            uploadImg(obj)
                        }
                    })
                } 
            }
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
                            <Spin tip="Loading..." spinning={isLoading}>
                            { confList[item.id] && confList[item.id].length?
                            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                            {confList[item.id].map(conf=>{
                                switch (conf.fieldType) {
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
                                                    valuePropName:'file',
                                                })(
                                                    <Upload
                                                        name={conf.ename}
                                                        listType="picture-card"
                                                        className="avatar-uploader"
                                                        showUploadList={false}
                                                        customRequest={uploadImg} 
                                                    >
                                                        { imgObj[conf.ename] ? <img src={imgObj[conf.ename]} alt={conf.name} style={{ width: '100%' }} /> : uploadButton}
                                                    </Upload>,
                                                )}
                                            </Form.Item>    
                                        );
                                    default:
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
                                } 

                            })}
                            <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
                            <Button type="primary"  size='large' onClick={submitFormData}>
                                保存
                            </Button>
                            </Form.Item>
                            </Form>: '暂无数据' }
                            </Spin>
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