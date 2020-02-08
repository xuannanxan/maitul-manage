/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 21:23:24
 * @LastEditTime : 2020-02-06 22:16:29
 * @LastEditors  : Xuannan
 */
import React,{useState,useEffect}from 'react';
import {Col,Button} from 'antd'
import {_rightAd} from '../config/api'
function Advert(){
    const [ad,setAd] = useState([])
    useEffect(()=>{
        _rightAd().then(res=>{
            setAd(res.data.data)
          })
          .catch(error=>{
            setAd([])
          })
      },[])
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
