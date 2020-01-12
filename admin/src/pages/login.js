/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-13 17:25:03
 * @LastEditTime : 2020-01-11 11:13:15
 * @LastEditors  : Xuannan
 */
import React , {useState,useEffect} from 'react';
import 'antd/dist/antd.css';
import { Card, Input, Icon,Button ,Spin ,Checkbox,Form} from 'antd';
import '../static/css/login.css'
import {_login,_captcha} from '../utils/api'


function LoginForm(props){
    const { getFieldDecorator } = props.form;
    const [isLoading, setIsLoading] = useState(false)
    const [imageCode,setImageCode]= useState('')
    const [captcha,setCaptcha]= useState('')
    const getCaptcha = ()=>{
        const image_code = Math.random().toString(36).substr(2, 15);
        setImageCode(image_code)
        _captcha(image_code).then(res=>{
            setCaptcha('data:image/jpeg;base64,'+res.data.data)
        })
    }
    useEffect(()=>{
        getCaptcha()
      },[])
    const checkLogin =  (e)=>{
        e.preventDefault();
        props.form.validateFields((err, values) => {
        if (!err) {
            _login(values.username,values.password,values.captcha,imageCode).then(res=>{
                localStorage.setItem('jwToken',res.data.token)
                props.history.push('/home') 
            })
            .catch(error=>{
                //登录失败重新获取验证码
                getCaptcha()
            })
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
                            suffix={<img alt="验证码" src={captcha} onClick={getCaptcha} className='captcha_img'></img>}
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