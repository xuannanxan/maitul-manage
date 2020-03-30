<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-30 21:49:32
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
            <ProductList
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
    import Tags from '@/components/common/Tags';
    import ProductList from '@/components/list/ProductList';
    import RightContact from '@/components/common/RightContact';
    import {mapState} from 'vuex';
    import {siteInfo}  from "@/config";
    import {findNodes} from '@/utils/treeNodes'
 
  const productData =  {
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
    components:{Header,Footer,Tags,ProductList,RightContact},
    computed:mapState(["webconfig"]),
    head () {
        const search = this.$route.query.search?'|'+this.$route.query.search:'';
        const tag = this.$route.query.tag?'|'+this.$route.query.tag:'';
        const siteTitle = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'Maitul.com');
        const pageTitle = productData.category.name?'|'+productData.category.name:'';
        return {
            title: siteTitle+pageTitle+search+tag,
            meta: [
            { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:'Maitul')+(productData.category.keywords?','+productData.category.keywords:'') },
            { hid: 'description', name: 'description', content: productData.category.description?productData.category.description:this.webconfig.siteDescription?this.webconfig.siteDescription:'Maitul'  }
            ]
        }
    },
    async asyncData({ store,app,params,query, error }){
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
          paginate:siteInfo.productPageSize,
          category_id:params.id,
          page:query.page,
          search:query.search,
          tag:query.tag,
          })])
      if(product.status === 200) {
          productData.data = product.data
          productData.paginate = product.paginate
          store.commit('setRelatedList',product.data)
      }else{
          productData.data = []
          productData.paginate = {}
      }
      productData.category_id = params.id?params.id:''
      productData.tag = query.tag?query.tag:''
      productData.search = query.search?query.search:''
      if(params.id){
          let cateoryData = findNodes(store.state.category,params.id)
          if(cateoryData.length){
              productData.category  = cateoryData[0]
              if(cateoryData[0].pid ==0){
                  productData.topCategory  = cateoryData[0]
              }else{
                  let topCateoryData = findNodes(store.state.category,cateoryData[0].pid)
                  if(topCateoryData.length){
                      productData.topCategory  = topCateoryData[0]
                  }
              }
          }
          
      }
      return productData;
    }
  };
</script>
<style lang="less" scoped>


</style>