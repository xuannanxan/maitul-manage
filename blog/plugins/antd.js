/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:26:57
 * @LastEditTime: 2020-02-19 11:23:43
 * @LastEditors: Xuannan
 */

import Vue from 'vue';
import '../assets/css/style.less';


import { 
    Affix,
    Skeleton,    
    Avatar,
    Layout,
    LocaleProvider,
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
    Spin ,
    Tag ,
    Pagination,
    Tooltip,
    Popover,
    Divider,
    Empty,
    Drawer,
    BackTop,
    message} from 'ant-design-vue';
    
Vue.use(Avatar)
Vue.use(Button)
Vue.use(Tag)
Vue.use(Input)
Vue.use(Divider)
Vue.use(Col)
Vue.use(Row)
Vue.use(List)
Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(Layout)
Vue.use(Breadcrumb)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Skeleton)
Vue.use(Spin)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Affix)
Vue.use(Empty)
Vue.use(Drawer)
Vue.use(BackTop)
Vue.prototype.$message = message;
