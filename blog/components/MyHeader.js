/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-03 20:08:46
 * @LastEditTime : 2020-02-03 21:38:50
 * @LastEditors  : Xuannan
 */
import Head from 'next/head'
import React from 'react';
const MyHeader =  (props)=>{
    return (
        <>
            <Head>
                <title> {props.params.title?props.params.title:'My Blog'} </title> 
                <meta name="keywords" content={props.params.keywords?props.params.keywords:'My Blog'} />
                <meta name="description" content={props.params.description?props.params.description:'My Blog'} />
            </Head>
        </>
    )
}

export default MyHeader