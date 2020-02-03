/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-03 18:22:44
 * @LastEditTime : 2020-02-03 19:45:03
 * @LastEditors  : Xuannan
 */
import React from 'react'
import '../public/style/pages/404.less'

const NotFound = ()=>{
    return (
        <div className="w3layouts-bg">
            <div className="agileits-content">
                <h2><span>4</span><span>0</span><span>4</span></h2>
                
            </div>
            <div className="w3layouts-right">
                <div className="w3ls-text">
                    <h3>we're sorry!</h3>
                    <h4 className="w3-agileits2">the page you requested could not be found.</h4>
                    <p>Please go back to the <a href="#">Home</a> page or contact us at <a href="mailto:admin@maitul.com">admin@maitul.com</a></p>
        
                </div>
                    
            </div>
            <div className="clearfix"></div>
        </div>
    )
}

export default NotFound