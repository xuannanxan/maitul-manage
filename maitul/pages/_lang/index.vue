<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-30 13:02:14
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
      <a-row>
        <a-col :span = "24" v-for="(cate,index) in category" :key="cate.id" :style="index%2===0?'':'background-color:rgb(232, 236, 236)'">
          <div class="main">
            <a-divider>{{cate.name}}</a-divider>
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
  import Tags from '@/components/common/Tags';
  import ArticleList from '@/components/list/ArticleList';
  import ProductList from '@/components/list/ProductList';
  import Info from '@/components/list/Info';
  import Contact from '@/components/list/Contact';
  import RightContact from '@/components/common/RightContact';
  import {siteInfo}  from "@/config";
 

  export default {
    scrollToTop: true,
    components:{Header,Footer,Banner,ArticleList,Tags,ProductList,Info,RightContact,Contact},
    data () {
      return {
        webconfig: this.$store.state.webconfig,
        category: this.$store.state.category,
        content: this.$store.state.content,
      }
    },
    head () {
      return {
        title: this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'Maitul.com'),
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.webconfig.siteKeywords?this.webconfig.siteKeywords:'Maitul' },
          { hid: 'description', name: 'description', content: this.webconfig.siteDescription?this.webconfig.siteDescription:'Maitul' }
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