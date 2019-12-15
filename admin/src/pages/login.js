/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-13 17:25:03
 * @LastEditTime: 2019-12-14 21:34:33
 * @LastEditors: Xuannan
 */
import React , {useState} from 'react';
import 'antd/dist/antd.css';
import { Card, Input, Icon,Button ,Spin ,Checkbox,Form} from 'antd';
import '../static/css/login.css'

function LoginForm(props){
    const { getFieldDecorator } = props.form;
    const [isLoading, setIsLoading] = useState(false)

    const checkLogin = (e)=>{
        e.preventDefault();
        props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
        }
        });
        setIsLoading(true)
        setTimeout(()=>{
            setIsLoading(false)
        },1000)
    }
    return (
        <div className='login'>
            <Spin tip="Loading..." spinning={isLoading}>               
                <Card title="Maitul Manage" bordered={true} style={{ width: 400 }} >
                    <Form onSubmit={checkLogin} className="login-form">
                        <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名"
                            size='large'
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input.Password
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            size='large'
                            placeholder="密码"
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                        {getFieldDecorator('captcha', {
                            rules: [{ required: true, message: '请输入验证码！' }],
                        })(
                            <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="验证码"
                            size='large'
                            suffix={<img alt="验证码" src='http://blogimages.jspang.com/blogtouxiang1.jpg' className='captcha_img'></img>}
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <br/>
                        <Button type="primary" htmlType="submit" size='large' className="login-form-button">
                            登 录
                        </Button>

                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        </div>
    )
}
const Login = Form.create({ name: 'normal_login' })(LoginForm);
export default Login