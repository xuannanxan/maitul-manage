/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 21:32:44
 * @LastEditTime: 2019-12-07 22:06:56
 * @LastEditors: Xuannan
 */
import React from 'react';
import {Avatar,Divider,Col} from 'antd'
import '../public/style/components/user.less'

function User(){

    return (
        <div className='user-div comm-right'>

            <div> <Avatar size={100} src="http://blogimages.jspang.com/blogtouxiang1.jpg"  /></div>
            <div className="user-introduction">
                光头程序员，专注于WEB和移动前端开发。要录1000集免费前端视频的傻X。此地维权无门，此时无能为力，此心随波逐流。
                <Divider>社交账号</Divider>
                <Avatar size={28} icon="github" className="account"  />
                <Avatar size={28} icon="qq"  className="account" />
                <Avatar size={28} icon="wechat"  className="account"  />

            </div>
        </div>
    )
}

export default User