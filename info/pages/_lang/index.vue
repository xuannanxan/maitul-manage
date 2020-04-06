<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-04-05 20:03:02
 * @LastEditors: Xuannan
 -->
<template>
  <a-layout class="layout ">
    <RightContact/>
    <a-back-top>
      <div class="right-btn"><a-icon type="to-top"/></div>
    </a-back-top>
    <Header :currentCategory="['home']"/>
    <Banner/>
    <a-layout-content class="content">
      <a-row class="main">
        <a-col :xs='24' :sm='24' :md='16' :lg='16' :xl='18' style="padding-right:2rem">
          <div v-for="(cate) in category" :key="cate.id"  v-if="content[cate.id]">
            <category-bar :category="cate"/>
            <product-list
            :data="content[cate.id]"
            :topCategory="cate"
            v-if="cate.module==='product'"
            />
            <article-list
            :data="content[cate.id]"
            v-if="cate.module==='article'"
            />

            <Info
            :data="content[cate.id]"
            v-if="cate.module==='info'"
            />
            <Contact
            :data="content[cate.id]"
            v-if="cate.module==='contact'"
            />
          
          </div>
        </a-col>
        <a-col :xs='0' :sm='0' :md='8' :lg='8' :xl='6'>
          <a-col>
            <a-affix :offsetTop="65">
              <Topic/>
            </a-affix>
          </a-col>
        </a-col>
      </a-row>
      <a-row>
        <Footer/>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>
<script>
  import Header from '@/components/common/Header';
  import Footer from '@/components/common/Footer';
  import Banner from '@/components/common/Banner';
  import Topic from '@/components/common/Topic';
  import ArticleList from '@/components/list/ArticleList';
  import ProductList from '@/components/list/ProductList';
  import Info from '@/components/list/Info';
  import Contact from '@/components/list/Contact';
  import RightContact from '@/components/common/RightContact';
  import CategoryBar from '@/components/common/CategoryBar';
  import {siteInfo}  from "@/config";
 

  export default {
    scrollToTop: true,
    components:{Header,Footer,Banner,ArticleList,Topic,ProductList,Info,RightContact,Contact,CategoryBar},
    data () {
      return {
        webconfig: this.$store.state.webconfig,
        category: this.$store.state.category,
        content: this.$store.state.content,
      }
    },
    head () {
      return {
        title: this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:this.$t('lang.siteName')),
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.webconfig.siteKeywords?this.webconfig.siteKeywords:this.$t('lang.siteName')},
          { hid: 'description', name: 'description', content: this.webconfig.siteDescription?this.webconfig.siteDescription:this.$t('lang.siteName')}
        ]
      }
    },
    async asyncData({app,params, store, error }){
      const locale = params.lang || app.i18n.fallbackLocale
      if(store.state.siteData && Object.keys(store.state.siteData).length===0){
          const  [siteData]  = await Promise.all([store.dispatch('_siteData')])
          if(siteData.status === 200) {
            store.commit('initData',({data:siteData.data,locale:locale}))
          }
      }else{
            store.commit('initData',({data:store.state.siteData,locale:locale}))
      }
    }
  };
</script>
<style lang="less" scoped>


</style>