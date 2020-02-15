<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime : 2020-02-14 22:46:59
 * @LastEditors: Xuannan
 -->
<template>
  <a-layout class="layout ">
    <Head></Head>
    <a-layout-content class="content">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item><nuxt-link to="/">home</nuxt-link></a-breadcrumb-item>
        <a-breadcrumb-item><nuxt-link to="/list">List</nuxt-link></a-breadcrumb-item>
        <a-breadcrumb-item><nuxt-link :to="{path:'/list',params:{newsId:3306}}">NEWS</nuxt-link></a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">Content</div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Power By Python + React + Vue + Nuxt + Ant Design
    </a-layout-footer>
  </a-layout>
</template>
<script>
  import {mapState} from 'vuex'
  import Head from '@/components/common/Head'
  export default {
    scrollToTop: true,
    components:{Head},
    methods: {
      onSearch(value) {
        console.log(value);
      },
    },
    computed:mapState(["webconfig"]),
    async  asyncData({ store, error }){
      if(store.state.webconfig && Object.keys(store.state.webconfig).length===0){
        const  [webconfig,category]  = await Promise.all([
          store.dispatch('_webconfig'),
          store.dispatch('_category')
        ])
        if(webconfig.status === 200) store.commit('setWebConfig',webconfig.data)
        if(category.status === 200) store.commit('setCategory',category.data)
      }
    }
  };
</script>
<style>

</style>