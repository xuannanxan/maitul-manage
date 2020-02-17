<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime : 2020-02-14 23:22:05
 * @LastEditors: Xuannan
 -->
<template>
    <a-layout-header class="header">
      <a-row>
        <a-col :xs='12' :sm='12' :md='6' :lg='6' :xl='6'>
          <nuxt-link to="/">
            <div class="logo">{{webconfig.siteName?webconfig.siteName:'My Blog'}}</div>
          </nuxt-link>
        </a-col>     
        <a-col :xs='0' :sm='0' :md='12' :lg='12' :xl='12'>
          <a-menu
            mode="horizontal"
            :defaultSelectedKeys="['2']"
            class="menu "
          >
            <a-menu-item>
              <nuxt-link to="/">首页</nuxt-link>
            </a-menu-item>
            <a-menu-item v-for="item in category" :key="item.id">
              <nuxt-link :to="{path:'/list/'+item.id}">{{item.name}}</nuxt-link>
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :xs='0' :sm='0' :md='5' :lg='5' :xl='5' :offset="1">
          <a-input-search size="large" placeholder="Search..." @search="onSearch" />
        </a-col>
      </a-row>
    </a-layout-header>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: 'Header',
    methods: {
        onSearch(value) {
            this.$router.push('/list?search='+value)    
        },
    },
    computed:{
      ...mapState(["webconfig"]),
      ...mapState(["category"]),
    },
  };
</script>
<style lang="less" scoped>
  .header{
    position:fixed;
    z-index:99;
    width: 100%;
    .logo {
      color: #00c58e;
      float: left;
      font-size: 1.5rem;
    }
    .menu{
      float: right;
      line-height: 62px;
      font-size: 1.2rem;
    }
  }

</style>