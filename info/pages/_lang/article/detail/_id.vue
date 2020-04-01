<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-04-01 16:01:36
 * @LastEditors: Xuannan
 -->
<template>
  <a-layout class="layout ">
    <RightContact/>
    <a-back-top>
      <div class="right-btn"><a-icon type="to-top"/></div>
    </a-back-top>
    <Header :currentCategory="[Object.keys(data).length?data.category_id:'']"/>
    <a-layout-content class="content">
      <a-row>
        <a-col :span="24">
          <div class="main">
            <Article
            :data="data"
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
    import Article from '@/components/detail/Article';
    import RightContact from '@/components/common/RightContact';
    import {mapState} from 'vuex';
    import {siteInfo}  from "@/config";
    import {findNodes} from '@/utils/treeNodes'
 
  const articleData =  {
        data:{},
      };
  export default {
    scrollToTop: true,
    components:{Header,Footer,Article,RightContact},
    computed:mapState(["webconfig"]),
    head () {
        const siteTitle = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:this.$t('lang.siteName'));
        const pageTitle = articleData.data.title?'|'+articleData.data.title:'';
        return {
            title: siteTitle+pageTitle,
            meta: [
            { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:this.$t('lang.siteName'))+(articleData.data.keywords?','+articleData.data.keywords:'') },
            { hid: 'description', name: 'description', content: articleData.data.description?articleData.data.description:this.webconfig.siteDescription?this.webconfig.siteDescription:this.$t('lang.siteName')}
            ]
        }
    },
    async asyncData({ store,params,query, error,app }){
      const locale = params.lang || app.i18n.fallbackLocale
      if(store.state.siteData && Object.keys(store.state.siteData).length===0){
          const  [siteData]  = await Promise.all([store.dispatch('_siteData')])
          if(siteData.status === 200) {
            store.commit('initData',({data:siteData.data,locale:locale}))
          }
      }else{
            store.commit('initData',({data:store.state.siteData,locale:locale}))
      }

      const  [article]  = await Promise.all([store.dispatch('_content',{
          id:params.id,
          })])
      if(article.status === 200) {
          articleData.data = article.data
      }else{
          articleData.data = {}
      }
      return articleData;
    }
  };
</script>
<style lang="less" scoped>


</style>