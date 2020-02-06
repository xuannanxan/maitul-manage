/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 21:32:44
 * @LastEditTime : 2020-02-06 20:25:25
 * @LastEditors  : Xuannan
 */
import React from 'react';
import {Avatar,Divider,Col} from 'antd'
import '../public/style/components/user.less'

function User(props){
    const {webconfig} = props
    return (
        <div className='user-div comm-right'>
            <div> <Avatar size={100} src={webconfig.blogAvatar?webconfig.blogAvatar:'/images/user.png'}/></div>
            <div className="user-introduction">
                {webconfig.blogAuthor}
                <Divider>社交账号</Divider>
                <Avatar size={28} icon="github" className="account"  />
                <Avatar size={28} icon="qq"  className="account" />
                <Avatar size={28} icon="wechat"  className="account"  />
            </div>
        </div>
    )
}

export default User