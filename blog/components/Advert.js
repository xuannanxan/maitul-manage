/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 21:23:24
 * @LastEditTime : 2020-02-08 21:04:38
 * @LastEditors  : Xuannan
 */
import React from 'react';
import {Button} from 'antd'
import {_rightAd} from '../config/api'
function Advert(props){
    const ad = props.ad?props.ad:[]
    return(
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
    )

}
export default Advert
