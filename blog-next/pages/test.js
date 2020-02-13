import React,{useState,useEffect} from 'react'
import {_Api,_Url} from '../config/api'
const Test = () =>{
    const [webconfig,setconfig] = useState({blogName:'1111'})
    const category = async()=>{
        const webconfig = await _Api(_Url.webconfigUrl)
        return webconfig.data
    } 

    useEffect(()=>{
        category().then(res=>{
            setconfig(res)
            console.log(res)
        })
        
        
    },[]

    )
    return(
        <div>
            {webconfig.blogName}
    <a href={_Url.clientUrl+_Url.webconfigUrl+'?site=blog'}>{_Url.clientUrl+_Url.webconfigUrl}</a>
        </div>
    )
}

export default Test