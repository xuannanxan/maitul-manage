/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:26:57
 * @LastEditTime: 2020-03-27 15:33:53
 * @LastEditors: Xuannan
 */

import Vue from 'vue';
import '../assets/css/style.less';


import { 
    Affix, 
    Avatar,
    Layout,
    Menu,
    Icon,
    Button,
    Breadcrumb,
    List,
    Input,
    Form,
    Row,
    Col,
    Carousel ,
    Tag ,
    Pagination,
    Tooltip,
    Popover,
    Divider,
    Empty,
    Drawer,
    BackTop,
    Card,
    Tabs,
    Dropdown,
    message} from 'ant-design-vue';
    
Vue.use(Avatar)
Vue.use(Button)
Vue.use(Tag)
Vue.use(Input)
Vue.use(Divider)
Vue.use(Col)
Vue.use(Row)
Vue.use(List)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(Layout)
Vue.use(Breadcrumb)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Affix)
Vue.use(Empty)
Vue.use(Drawer)
Vue.use(BackTop)
Vue.use(Form)
Vue.use(Dropdown)
Vue.prototype.$message = message;
