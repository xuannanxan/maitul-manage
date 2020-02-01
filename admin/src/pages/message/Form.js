/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-01-27 21:27:29
 * @LastEditTime : 2020-02-01 22:55:41
 * @LastEditors  : Xuannan
 */
import React, {useImperativeHandle} from 'react';
import { Input ,Form,Switch ,message,Icon} from 'antd';
import {_messageReply} from '../../utils/api'

const {TextArea} = Input

function SubmitForm(props){
    let { form,params,site ,handleCancel} = props
    const { getFieldDecorator } = form; //表单内容
    
    useImperativeHandle(props.cRef, () => ({
        // 暴露给父组件的方法
        submitFormData:()=>{
            form.validateFields((err, values) => {
                if (!err) {
                    values.id = params.id
                    values.site = site
                    values.show = values.show?1:0
                    _messageReply(values).then(res=>{
                        if(res.data.status === 200){
                            message.success(res.data.msg)
                            handleCancel()
                        }
                    })
                }
                });
        },
        init:()=>{
            if(params){
                form.setFieldsValue({
                    reply:params.reply,
                    show:params.show?true:false,
                })
            }
        }
    }));

    return(
        <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item label="联系人">
                    <h4 className="ant-form-text">{params.name}</h4>
                    <p className="ant-form-text"><Icon type="environment" />{params.ip}</p>
                    <p className="ant-form-text"><Icon type="clock-circle" />{params.create_time}</p>
                </Form.Item>
                <Form.Item label="联系方式">
                    <h4 className="ant-form-text"><Icon type="mail" /> {params.email}</h4>
                    <h4 className="ant-form-text"><Icon type="phone" /> {params.contact}</h4>
                </Form.Item>
                <Form.Item label="留言内容">
                    <span className="ant-form-text">{params.info}</span>
                </Form.Item>
                <Form.Item label='回复'>
                {getFieldDecorator('reply', {
                })(
                    <TextArea 
                    rows={3}
                    placeholder="请输入回复内容..."
                    />,
                )}
                </Form.Item>
                <Form.Item label='发送邮件'>
                    {getFieldDecorator('sendmail', {
                        valuePropName: 'checked'
                    })(
                        <Switch />,
                    )}
                </Form.Item>
                <Form.Item label='是否显示'>
                    {getFieldDecorator('show', {
                        valuePropName: 'checked'
                    })(
                        <Switch />,
                    )}
                </Form.Item>
                </Form>
        </div>
    )
}
const ReplyForm = Form.create({ name: 'reply_form' })(SubmitForm);
export default ReplyForm
