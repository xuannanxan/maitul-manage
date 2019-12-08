/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:31:52
 * @LastEditTime: 2019-12-07 00:19:19
 * @LastEditors: Xuannan
 */
import React from 'react'
import Head from 'next/head'
import { Button,Row,Col } from 'antd'
import Header from '../components/Header'

const Detail = () => (
  <>
    <Head>
      <title>Home</title>
      <div>
        <Header/>
        <Row className="comm-main" type="flex" justify="center">
          <Col className="comm-left" xs={24} sm={24} md={16} lg={15} xl={15}  >
            左侧
          </Col>

          <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={5}>
            右侧
          </Col>
        </Row>
      </div>
    </Head>
  </>
)

export default Detail
