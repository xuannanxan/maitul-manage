/*
 * @Description: 内容区域，用路由来控制内容显示
 * @Author: Xuannan
 * @Date: 2019-12-13 22:04:15
 * @LastEditTime: 2019-12-14 17:58:08
 * @LastEditors: Xuannan
 */

import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Login from './Login'
import Home from './Home'


function Main(){
    return (
        <Router>      
            <Route path="/login/" exact component={Login} />
            <Route path="/home/" exact component={Home} />
        </Router>
    )
}
export default Main