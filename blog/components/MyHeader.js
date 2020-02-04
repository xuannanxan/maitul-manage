/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-03 20:08:46
 * @LastEditTime : 2020-02-04 20:30:22
 * @LastEditors  : Xuannan
 */
import Head from 'next/head'
import React from 'react';
const MyHeader =  (props)=>{
    return (
        <>
            <Head>
                <title> {props.webconfig.blogName?props.webconfig.blogName:"Allen's Blog"} </title> 
                <meta name="keywords" content={props.webconfig.blogKeywords?props.webconfig.blogKeywords:"Allen's Blog"} />
                <meta name="description" content={props.webconfig.blogDescription?props.webconfig.blogDescription:"Welcome to my blog..."} />
            </Head>
        </>
    )
}

export default MyHeader