<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-04-08 14:50:13
 * @LastEditors: Xuannan
 -->
<template>
  <a-layout class="layout ">
    <RightContact/>
    <a-back-top>
      <div class="right-btn"><a-icon type="to-top"/></div>
    </a-back-top>
    <Header :currentCategory="[category_id?category_id:'']"/>
    <a-layout-content class="content">
      <a-row>
        <a-col :span="24">
          <div class="main">
            <ArticleList
            :data="data"
            :paginate="paginate"
            :tag="tag"
            :search="search"
            :category="category"
            :topCategory="topCategory"
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
 
  const articleData =  {
        data:[],
        paginate:{},
        category_id:'',
        tag:'',
        search:'',
        category:{},
        topCategory:{},
      };
  export default {
    watchQuery: ['page','tag','search'],
    scrollToTop: true,
    components:{Header,Footer,ArticleList,RightContact},
    computed:mapState(["webconfig"]),
    head () {
        const search = this.$route.query.search?'|'+this.$route.query.search:'';
        const tag = this.$route.query.tag?'|'+this.$route.query.tag:'';
        const siteTitle = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:this.$t('lang.siteName'))
        const pageTitle = articleData.category.name?'|'+articleData.category.name:''
        return {
            title: siteTitle+pageTitle+search+tag,
            meta: [
            { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:this.$t('lang.siteName'))+(articleData.category.keywords?','+articleData.category.keywords:'') },
            { hid: 'description', name: 'description', content: articleData.category.description?articleData.category.description:this.webconfig.siteDescription?this.webconfig.siteDescription:this.$t('lang.siteName')}
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
            paginate:siteInfo.articlePageSize,
            category_id:params.id,
            page:query.page,
            search:query.search,
            tag:query.tag,
            })])
        if(article.status === 200) {
            articleData.data = article.data
            articleData.paginate = article.paginate
        }else{
            articleData.data = []
            articleData.paginate = {}
        }
        articleData.category_id = params.id?params.id:''
        articleData.tag = query.tag?query.tag:''
        articleData.search = query.search?query.search:''
        if(params.id){
            let cateoryData = findNodes(store.state.category,params.id)
            if(cateoryData.length){
                articleData.category  = cateoryData[0]
                if(cateoryData[0].pid ==0){
                    articleData.topCategory  = cateoryData[0]
                }else{
                    let topCateoryData = findNodes(store.state.category,cateoryData[0].pid)
                    if(topCateoryData.length){
                        articleData.topCategory  = topCateoryData[0]
                    }
                }
            }
           
        }
      return articleData;
    }
  };
</script>
<style lang="less" scoped>


</style>