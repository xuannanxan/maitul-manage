/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-07 16:12:26
 * @LastEditTime: 2020-02-07 13:29:37
 * @LastEditors: Xuannan
 */
import React,{useState,useEffect}from 'react';
import {Carousel,Button} from 'antd'
import {_banner} from '../config/api'


function Banner(){
    const [banner,setBanner] = useState([])
    useEffect(()=>{
        _banner().then(res=>{
            setBanner(res.data.data)
          })
          .catch(error=>{
            setBanner([])
          })
      },[])
    return(
        <div>
            <Carousel autoplay>
                {banner && banner.length?
                banner.map(item=>{
                    return (
                        <div key={item.id}>
                            <div className='banner' style={{backgroundImage:'url('+item.img+')'}} >
                                <div className='shade'> </div>
                                <div className='info'>
                                    <h1>{item.name}</h1>
                                    <p>{item.info}</p>
                                    <Button  target="_blank" href={item.url} type="primary" size='large'>Learn More</Button>
                                </div>


                            </div>
                        </div>
                    )
                })
                : <div><h3>No Image</h3></div>}
              
            </Carousel>  
        </div>
    )

}
export default Banner
