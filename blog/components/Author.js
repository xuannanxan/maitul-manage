/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 21:32:44
 * @LastEditTime : 2020-02-07 21:38:23
 * @LastEditors  : Xuannan
 */
import React from 'react';
import {Avatar,Divider,Popover,Tooltip  } from 'antd'

function Author(props){
    const {webconfig} = props
    return (
            <div className='user-div comm-right'>
                <div> <Avatar size={100} src={webconfig.blogAvatar?webconfig.blogAvatar:'/images/user.png'}/></div>
                <div className="user-introduction">
                    {webconfig.blogAuthor}
                    <Divider>社交账号</Divider>
                    <Tooltip placement="topLeft" trigger="hover" title={webconfig.blogQQ}>
                        <Avatar size={28} icon="qq"  className="account" />
                    </Tooltip>
                    <Popover placement="topRight" trigger="hover" content={<img size={100} src={webconfig.blogAvatar?webconfig.blogAvatar:'/images/user.png'}/>}>
                        <Avatar size={28} icon="wechat"  className="account"  />
                    </Popover>
                </div>
            </div>   
    )
}

export default Author