/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime: 2019-12-07 15:44:14
 * @LastEditors: Xuannan
 */
import React from 'react'
import Head from 'next/head'
import { Button } from 'antd'
import Header from '../components/Header'

const Home = () =>{
    const clickBtn = ()=>{
      console.log('111111111111')
    }
    return (
      <>
        <Head>
          <title>Home</title>
        </Head>
          <div>
            <Header/>
            <Button onClick={clickBtn}>click</Button>
          </div>
        
      </>
    )
} 

export default Home
