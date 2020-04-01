<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-04-01 16:05:18
 * @LastEditors: Xuannan
 -->
<template>
  <a-layout class="layout ">
    <RightContact/>
    <a-back-top>
      <div class="right-btn"><a-icon type="to-top"/></div>
    </a-back-top>
    <Header :currentCategory="[]"/>
    <a-layout-content class="content">
      <a-row>
        <a-col :span="24">
          <div class="main">
            <ArticleList
            :data="data"
            :paginate="paginate"
            :search="search"
            :tag="tag"
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
    import ArticleList from '@/components/list/ArticleList';
    import RightContact from '@/components/common/RightContact';
    import {mapState} from 'vuex';
    import {siteInfo}  from "@/config";
    import {findNodes} from '@/utils/treeNodes'
 
  const contentData =  {
        data:[],
        paginate:{},
        search:'',
        tag:'',
      };
  export default {
    watchQuery: ['page','tag','search'],
    scrollToTop: true,
    components:{Header,Footer,ArticleList,RightContact},
    computed:mapState(["webconfig"]),
    head () {
      const title = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:this.$t('lang.siteName'));
      const search = this.$route.query.search?'|'+this.$route.query.search:'';
      const tag = this.$route.query.tag?'|'+this.$route.query.tag:'';
      return {
        title: title+search+tag,
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.webconfig.siteKeywords?this.webconfig.siteKeywords:this.$t('lang.siteName')},
          { hid: 'description', name: 'description', content: this.webconfig.siteDescription?this.webconfig.siteDescription:this.$t('lang.siteName')}
        ]
      }
    },
    async asyncData({ store,params,query, error ,app}){
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
            paginate:siteInfo.productPageSize,
            page:query.page,
            search:query.search,
            tag:query.tag,
            })])
        if(article.status === 200) {
            contentData.data = article.data
            contentData.paginate = article.paginate
        }else{
            contentData.data = []
            contentData.paginate = {}
        }
        contentData.search = query.search?query.search:''
        contentData.tag = query.tag?query.tag:''
      return contentData;
    }
  };
</script>
<style lang="less" scoped>


</style>