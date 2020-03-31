<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-31 13:49:20
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
        <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
          <div class="main">
            <Info
            :data="data"
            :maxHeight='false'
            />
          </div>
        </a-col>
        <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <div class="main">
                <Message :showName="true"  :showPhone="true"/>
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
    import Tags from '@/components/common/Tags';
    import Info from '@/components/list/Info';
    import RightContact from '@/components/common/RightContact';
    import Message from '@/components/common/Message.vue'
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
    components:{Header,Footer,Info,RightContact,Message},
    computed:mapState(["webconfig"]),
    head () {
        const siteTitle = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'Maitul.com')
        const pageTitle = articleData.category.name?'|'+articleData.category.name:''
        return {
            title: siteTitle+pageTitle,
            meta: [
            { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:'Maitul')+(articleData.category.keywords?','+articleData.category.keywords:'') },
            { hid: 'description', name: 'description', content: articleData.category.description?articleData.category.description:this.webconfig.siteDescription?this.webconfig.siteDescription:'Maitul'  }
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
            category_id:params.id,
            category:params.id?'':siteInfo.news,
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