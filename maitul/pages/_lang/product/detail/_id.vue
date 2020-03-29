<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-29 20:39:00
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
    async asyncData({ store,params,query, error }){
      if(store.state.webconfig && Object.keys(store.state.webconfig).length===0){
        const  [siteData]  = await Promise.all([store.dispatch('_siteData')])
        if(siteData.status === 200) {
            store.commit('setWebConfig',siteData.data.webconfig)
            store.commit('setCategory',siteData.data.category)
            store.commit('setTags',siteData.data.tags)
            store.commit('setAdspace',(siteData.data.adspace))
          }
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
            productData.data = product.data
        }else{
            productData.data = {}
        }
      return productData;
    }
  };
</script>
<style lang="less" scoped>


</style>