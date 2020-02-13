/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-03 20:08:46
 * @LastEditTime : 2020-02-09 22:35:05
 * @LastEditors  : Xuannan
 */
import Head from 'next/head'
import React from 'react';
const Header =  ({webconfig,currentCategory,content})=>
        <>
        {content?
        <Head>
            <title> {(webconfig.blogName?webconfig.blogName:"Allen's Blog")+(content?'|'+content.title:'')} </title> 
            <meta name="keywords" content={(webconfig.blogKeywords?webconfig.blogKeywords:"Allen's Blog")+(content?','+content.keywords:'') }/>
            <meta name="description" content={(webconfig.blogDescription?webconfig.blogDescription:"Welcome to my blog...")+(content?','+content.description:'') } />
        </Head>
        :<Head>
            <title> {(webconfig.blogName?webconfig.blogName:"Allen's Blog")+(currentCategory?'|'+currentCategory.name:'')} </title> 
            <meta name="keywords" content={(webconfig.blogKeywords?webconfig.blogKeywords:"Allen's Blog")+(currentCategory?','+currentCategory.keywords:'') }/>
            <meta name="description" content={(webconfig.blogDescription?webconfig.blogDescription:"Welcome to my blog...")+(currentCategory?','+currentCategory.description:'') } />
        </Head>}
        </>

export default Header