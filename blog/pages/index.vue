<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-02-18 21:41:57
 * @LastEditors: Xuannan
 -->
<template>
  <a-layout class="layout ">
    <Header :currentCategory="'home'"/>
    <a-layout-content class="content">
      <a-row>
        <a-col :xs='24' :sm='24' :md='18' :lg='18' :xl='18'>
          <div class="main">
            <Banner/>
          </div>
          <div class="main">
            <ArticleList 
            :data="data"
            :paginate="paginate"
            :tag="tag"
            :search="search"
            :category="category"/>
          </div>
          <a-layout-footer style="text-align: center">
            {{webconfig.siteFoot?webconfig.siteFoot:'My blog'}}
          </a-layout-footer>
        </a-col>
        <a-col :xs='0' :sm='0' :md='6' :lg='6' :xl='6'>
          <div class="main right" v-for="item in rightAd" :key="item.id">
            <RightAd :ad='item'/>
          </div>
          <a-affix :offsetTop="65">
            <div class="main right">
              <Author/>
            </div>
          </a-affix>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>
<script>
  import Header from '@/components/common/Header';
  import Banner from '@/components/common/Banner';
  import Author from '@/components/common/Author';
  import RightAd from '@/components/common/RightAd';
  import ArticleList from '@/components/list/ArticleList';
  import {mapState} from 'vuex'
  const pageSize = 10;
  const contenData =  {
        data:[],
        paginate:{},
        tag:'',
        search:'',
        category:{}
      };
  export default {
    scrollToTop: true,
    components:{Header,Banner,Author,RightAd,ArticleList},
    computed:mapState(["rightAd","webconfig"]),
    head () {
      return {
        title: this.webconfig.siteName?this.webconfig.siteName:'My blog',
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.webconfig.siteKeywords?this.webconfig.siteKeywords:'My blog' },
          { hid: 'description', name: 'description', content: this.webconfig.siteDescription?this.webconfig.siteDescription:'My blog' }
        ]
      }
    },
    async asyncData({ store, error }){
      if(store.state.webconfig && Object.keys(store.state.webconfig).length===0){
        const  [webconfig]  = await Promise.all([store.dispatch('_webconfig')])
        if(webconfig.status === 200) store.commit('setWebConfig',webconfig.data)
      }
      if(store.state.category && store.state.category.length===0){
        const  [category]  = await Promise.all([store.dispatch('_category')])
        if(category.status === 200) store.commit('setCategory',category.data)
      }
      if(store.state.banner && store.state.banner.length===0){
        const  [banner]  = await Promise.all([store.dispatch('_banner')])
        if(banner.status === 200) store.commit('setBanner',banner.data)
      }
      if(store.state.rightAd && store.state.rightAd.length===0){
        const  [rightAd]  = await Promise.all([store.dispatch('_rightAd')])
        if(rightAd.status === 200) store.commit('setRightAd',rightAd.data)
      }
      const  [content]  = await Promise.all([store.dispatch('_content',{paginate:pageSize})])
      if(content.status === 200) {
          contenData.data = content.data
          contenData.paginate = content.paginate
        }
      return contenData
    }
  };
</script>
<style>

</style>