<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-02-22 20:18:19
 * @LastEditors: Xuannan
 -->
<template>
  <a-layout class="layout ">
    <a-back-top>
      <a-button type="primary" shape="circle" icon="to-top" size='large' ghost></a-button>
    </a-back-top>
    <Header :currentCategory="['home']"/>
    <Banner/>
    <a-layout-content class="content">
      <a-row>
        <a-col :span="24">
          <div class="main">
            <a-divider>Products</a-divider>
            <ProductList
            :data="data"
            :paginate="paginate"
            :tag="tag"
            :search="search"
            :category="category"
            />
          </div>
        </a-col>
        <a-col :span="24">
          <div class="main dark">
            <About
            :data="data"
            />
          </div>
        </a-col>
      </a-row>
      
    </a-layout-content>
    
    <a-layout-content class="content">
      <a-row>
        <a-col :span="24">
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
            <div class="main right">
              <Tags/>
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
  import Tags from '@/components/common/Tags';
  import ArticleList from '@/components/list/ArticleList';
  import ProductList from '@/components/list/ProductList';
  import About from '@/components/list/About';
  import {mapState} from 'vuex';
  import {siteInfo}  from "@/service/config";
  const pageSize = 12;
  const contenData =  {
        data:[],
        paginate:{},
        tag:'',
        search:'',
        category:{}
      };
  export default {
    scrollToTop: true,
    components:{Header,Banner,Author,RightAd,ArticleList,Tags,ProductList,About},
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
      if(store.state.tags && store.state.tags.length===0){
        const  [tags]  = await Promise.all([store.dispatch('_tags')])
        if(tags.status === 200) store.commit('setTags',tags.data)
      }
      if(store.state.about && store.state.about.length===0){
        const  [aboutData]  = await Promise.all([store.dispatch('_content',{
          paginate:pageSize,
          category:siteInfo.about,
          })])
        if(aboutData.status === 200) store.commit('setAbout',aboutData.data)
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
<style lang="less" scoped>


</style>