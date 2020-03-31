<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-30 23:03:49
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
            <Product
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
    import Tags from '@/components/common/Tags';
    import Product from '@/components/detail/Product';
    import RightContact from '@/components/common/RightContact';
    import {mapState} from 'vuex';
    import {siteInfo}  from "@/config";
    import {findNodes} from '@/utils/treeNodes'
 
  const productData =  {
        data:{},
      };
  export default {
    scrollToTop: true,
    components:{Header,Footer,Tags,Product,RightContact},
    computed:mapState(["webconfig"]),
    head () {
        const siteTitle = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'Maitul.com');
        const pageTitle = productData.data.title?'|'+productData.data.title:'';
        return {
            title: siteTitle+pageTitle,
            meta: [
            { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:'Maitul')+(productData.data.keywords?','+productData.data.keywords:'') },
            { hid: 'description', name: 'description', content: productData.data.description?productData.data.description:this.webconfig.siteDescription?this.webconfig.siteDescription:'Maitul'  }
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
        const  [product]  = await Promise.all([store.dispatch('_content',{
            id:params.id,
            })])
        if(product.status === 200) {
            productData.data = product.data
            if((store.state.relatedList).length===0){
              store.commit('setRelatedList',(store.state.content[product.data.pid===0?product.data.category_id:product.data.pid]))
            }
        }else{
            productData.data = {}
        }
      return productData;
    }
  };
</script>
<style lang="less" scoped>


</style>