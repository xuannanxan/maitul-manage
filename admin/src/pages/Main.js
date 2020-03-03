/*
 * @Description: 内容区域，用路由来控制内容显示
 * @Author: Xuannan
 * @Date: 2019-12-13 22:04:15
 * @LastEditTime : 2020-01-11 19:35:18
 * @LastEditors  : Xuannan
 */

import React from 'react';
import { HashRouter  as Router, Route ,Switch} from "react-router-dom";
import Login from './Login'
import Home from './Home'



function Main(){
    return (
        <Router> 
            <Switch>
                <Route path="/login/" exact  component={Login} />
                <Route path="/"  component={Home} />
            </Switch>     
        </Router>
    )
}
export default Main