<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-07 10:47:34
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
    import Contact from '@/components/common/Contact';
    import RightContact from '@/components/common/RightContact';
    import {mapState} from 'vuex';
    import {siteInfo}  from "@/service/config";
    import {findNodes} from '@/utils/treeNodes'
 
  const articleData =  {
        data:{},
      };
  export default {
    scrollToTop: true,
    components:{Header,Footer,Article,Contact,RightContact},
    computed:mapState(["webconfig"]),
    head () {
        const siteTitle = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'Maitul.com');
        const pageTitle = articleData.data.title?'|'+articleData.data.title:'';
        return {
            title: siteTitle+pageTitle,
            meta: [
            { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:'Maitul')+(articleData.data.keywords?','+articleData.data.keywords:'') },
            { hid: 'description', name: 'description', content: articleData.data.description?articleData.data.description:this.webconfig.siteDescription?this.webconfig.siteDescription:'Maitul'  }
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
        if(store.state.productList && store.state.productList.length===0){
            const  [productList]  = await Promise.all([store.dispatch('_content',{
              paginate:siteInfo.productPageSize,
              category:siteInfo.products,
            })])
            if(productList.status === 200) store.commit('setProductList',productList.data)
        }
        const  [product]  = await Promise.all([store.dispatch('_content',{
            id:params.id,
            })])
        if(product.status === 200) {
            articleData.data = product.data
        }else{
            articleData.data = {}
        }
      return articleData;
    }
  };
</script>
<style lang="less" scoped>


</style>