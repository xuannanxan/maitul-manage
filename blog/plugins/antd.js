/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:26:57
 * @LastEditTime : 2020-02-14 13:10:10
 * @LastEditors  : Xuannan
 */

import Vue from 'vue';
import '../assets/style.less';
import 'ant-design-vue/es/button/style';

import {     
    Avatar,
    Layout,
    LocaleProvider,
    Menu,
    Icon,
    Button,
    Breadcrumb,
    Popover,
    List,
    Input,
    Form,
    Row,
    Col,
    Carousel ,
    Spin ,
    Tag ,
    Pagination,
    Tooltip,
    Divider,
    message} from 'ant-design-vue';
Vue.use(Button)
Vue.use(Input)
Vue.use(Divider)
Vue.use(Col)
Vue.use(Row)
Vue.use(Layout)
Vue.use(Breadcrumb)
Vue.use(Menu)
Vue.prototype.$message = message;
