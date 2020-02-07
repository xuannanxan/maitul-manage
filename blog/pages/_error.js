/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-07 10:07:32
 * @LastEditTime : 2020-02-07 15:42:58
 * @LastEditors  : Xuannan
 */
import React from 'react'
import '../public/style/pages/error.less'
const Error  = (props) =>{
    return (
                <div className="w3layouts-bg">
                    <div className="agileits-content">
                        <h2><span>{props.statusCode? props.statusCode:502}</span></h2>
                    </div>
                    <div className="w3layouts-right">
                        <div className="w3ls-text">
                            <h3>we're sorry!</h3>
                            <h4 className="w3-agileits2">Unable to connect server.</h4>
                            <p>Please contact us at <a href="mailto:admin@maitul.com">admin@maitul.com</a></p>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            )
}

Error.getInitialProps= async ({res,err})=>{
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }



export default Error