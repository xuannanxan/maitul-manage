/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 21:23:24
 * @LastEditTime : 2020-02-09 22:28:43
 * @LastEditors  : Xuannan
 */
import React from 'react';
import {Button} from 'antd'
import {_rightAd} from '../config/api'
const Advert=({ad})=>
        <div >
            {ad&&ad.length?
            ad.map(item=>{
                return(
                    <div key={item.id} className="right-ad comm-right" style={{backgroundImage:'url('+item.img+')'}} >
                        
                        <Button type="link" href={item.url} target="_blank" >{item.name}</Button>
                    </div>
                )
            }):''} 
        </div>

export default Advert
