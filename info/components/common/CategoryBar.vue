<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-04-03 19:49:50
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <div class="cate" v-if="Object.keys(category).length">
            <a-col :xs='20' :sm='20' :md='20' :lg='22' :xl='22'>
                <div v-if="category.children && Object.keys(category.children).length" >
                    <a-menu
                    mode="horizontal"
                    class="sub-category"
                    >
                    <template v-for="item in category.children">
                        <a-menu-item :key="item.id">
                            <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/'+item.id}"><a-icon v-if="item.icon" :type="item.icon" :style="{ fontSize: '16px'}"/>{{item.name}}</nuxt-link>
                        </a-menu-item>
                    </template>
                    </a-menu>
                </div>         
                <div class="title" v-else><span>{{category.name}}</span> </div>
            </a-col>
            <a-col :xs='4' :sm='4' :md='4' :lg='2' :xl='2'>
                <div class="floatRight" style="line-height: 2.5rem;"><a-button type="link" block >{{$t('lang.more')}}<a-icon type="right" /></a-button></div>
            </a-col>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'ContactBtn',
    data () {
        return {
            locale:this.$i18n.locale,
        }
    },
    props:['category']
  };
</script>
<style lang="less" scoped>
.cate{
    height: 2.5rem;
    margin: 1rem 0;
    font-size: 1.1rem;
    font-weight: 500;
    background-color: #f1f1f1;
    .title{
        line-height: 2.5rem;
        padding:0 .5rem;
        span{
            padding:0 1.5rem 0 .5rem;
            border-left: 4px solid #00cccc;
        }
    }
    .sub-category{
        line-height: 2.4rem;
        font-size: 1.1rem;
        background-color: #f1f1f1;
    }
}


</style>