<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-19 21:46:22
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
        <a-col :span="24">
          <div class="main">
            <a-divider>Products</a-divider>
            <ProductList
            :data="productData.data"
            :paginate="productData.paginate"
            />
          </div>
        </a-col>
        <a-col :span="24">
          <div class="main dark">
            <Info
            :data="about"
            />
          </div>
        </a-col>
        <a-col :span="24">
          <div class="main">
            <a-divider>News</a-divider>
            <ArticleList
            :data="newsData.data"
            :paginate="newsData.paginate"
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
  import Contact from '@/components/common/Contact';
  import RightContact from '@/components/common/RightContact';
  import {mapState} from 'vuex';
  import {siteInfo}  from "@/service/config";
 
  const listData =  {
      data:[],
      paginate:{},
    };
  const contenData =  {
        newsData:{ ...listData },
        productData:{ ...listData },
      };
  export default {
    scrollToTop: true,
    components:{Header,Footer,Banner,ArticleList,Tags,ProductList,Info,Contact,RightContact},
    computed:mapState(["webconfig",'about']),
    head () {
      return {
        title: this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'Maitul.com'),
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.webconfig.siteKeywords?this.webconfig.siteKeywords:'Maitul' },
          { hid: 'description', name: 'description', content: this.webconfig.siteDescription?this.webconfig.siteDescription:'Maitul' }
        ]
      }
    },
    async asyncData({ store, error }){
      if(store.state.webconfig && Object.keys(store.state.webconfig).length===0){
        const  [siteData]  = await Promise.all([store.dispatch('_siteData')])
        if(siteData.status === 200) {
            store.commit('setWebConfig',siteData.data.webconfig)
            store.commit('setCategory',siteData.data.category)
            store.commit('setTags',siteData.data.tags)
            store.commit('setAdspace',(siteData.data.adspace))
          }
      }
      if(store.state.about && store.state.about.length===0){
        const  [aboutData]  = await Promise.all([store.dispatch('_content',{
          paginate:siteInfo.articlePageSize,
          category:siteInfo.about,
          })])
        if(aboutData.status === 200) store.commit('setAbout',aboutData.data)
      }
      const  [news]  = await Promise.all([store.dispatch('_content',{
        paginate:siteInfo.articlePageSize,
        category:siteInfo.news,
        })])
      if(news.status === 200) {
          contenData.newsData.data = news.data
          contenData.newsData.paginate = news.paginate
        }
      const  [product]  = await Promise.all([store.dispatch('_content',{
        paginate:siteInfo.productPageSize,
        category:siteInfo.products,
        })])
      if(product.status === 200) {
          contenData.productData.data = product.data
          contenData.productData.paginate = product.paginate
          store.commit('setProductList',product.data)
        }
      return contenData;
    }
  };
</script>
<style lang="less" scoped>


</style>