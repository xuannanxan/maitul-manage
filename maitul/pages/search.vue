<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-07 10:34:50
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
    import Contact from '@/components/common/Contact';
    import RightContact from '@/components/common/RightContact';
    import {mapState} from 'vuex';
    import {siteInfo}  from "@/service/config";
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
    components:{Header,Footer,ArticleList,Contact,RightContact},
    computed:mapState(["webconfig"]),
    head () {
      const title = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'Maitul.com');
      const search = this.$route.query.search?'|'+this.$route.query.search:'';
      const tag = this.$route.query.tag?'|'+this.$route.query.tag:'';
      return {
        title: title+search+tag,
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.webconfig.siteKeywords?this.webconfig.siteKeywords:'Maitul' },
          { hid: 'description', name: 'description', content: this.webconfig.siteDescription?this.webconfig.siteDescription:'Maitul' }
        ]
      }
    },
    async asyncData({ store,params,query, error }){
        if(store.state.webconfig && Object.keys(store.state.webconfig).length===0){
            const  [webconfig]  = await Promise.all([store.dispatch('_webconfig')])
            if(webconfig.status === 200) store.commit('setWebConfig',webconfig.data)
        }
        if(store.state.category && store.state.category.length===0){
            const  [category]  = await Promise.all([store.dispatch('_category')])
            if(category.status === 200) store.commit('setCategory',category.data)
        }
        if(store.state.tags && store.state.tags.length===0){
            const  [tags]  = await Promise.all([store.dispatch('_tags')])
            if(tags.status === 200) store.commit('setTags',tags.data)
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