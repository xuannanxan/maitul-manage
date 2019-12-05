/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:37:26
 * @LastEditTime: 2019-12-05 21:37:32
 * @LastEditors: Xuannan
 */
const withCss = require('@zeit/next-css')

if(typeof require !== 'undefined'){
    require.extensions['.css']=file=>{}
}

module.exports = withCss({})