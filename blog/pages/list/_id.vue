<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 19:34:49
 * @LastEditTime: 2020-02-28 14:18:14
 * @LastEditors: Xuannan
 -->
<template>
    <a-layout class="layout ">
        <a-back-top>
            <a-button type="primary" shape="circle" icon="to-top" size='large'></a-button>
        </a-back-top>
        <Header :currentCategory="[category.id?category.id:'']"/>
        <a-layout-content class="content">
        <a-row>
            <a-col :xs='24' :sm='24' :md='18' :lg='18' :xl='18'>
            <div class="main">
                <ArticleList 
                :data="data"
                :paginate="paginate"
                :tag="tag"
                :search="search"
                :category="category"/>
            </div>
            <a-layout-footer style="text-align: center">
                {{webconfig.siteFoot?webconfig.siteFoot:'My blog'}}
            </a-layout-footer>
            </a-col>
            <a-col :xs='0' :sm='0' :md='6' :lg='6' :xl='6'>
                <div class="main right" v-for="item in rightAd" :key="item.id">
                    <RightAd :ad='item'/>
                </div>
                <a-affix :offsetTop="65">
                    <div class="main right">
                        <Author/>
                    </div>
                    <div class="main right">
                        <Tags/>
                    </div>
                </a-affix>
            </a-col>
        </a-row>
        </a-layout-content>
    </a-layout>
</template>
<script>
    import Header from '@/components/common/Header';
    import Author from '@/components/common/Author';
    import RightAd from '@/components/common/RightAd';
    import Tags from '@/components/common/Tags';
    import ArticleList from '@/components/list/ArticleList';
    import {findNodes} from '@/utils/treeNodes'
    import {mapState} from 'vuex'
    const pageSize = 10;
    const contenList =  {
        data:[],
        paginate:{},
        tag:'',
        search:'',
        category:{}
        };
    export default {
        // validate ({ params }) {
        //     // Must be a number
        //     return /^\d+$/.test(params.id)
        // },
        watchQuery: ['page','tag','search'],
        scrollToTop: true,
        components:{Header,Author,RightAd,ArticleList,Tags},
        computed:mapState(["rightAd","webconfig"]),
        head () {
            return {
                title: (this.webconfig.siteName?this.webconfig.siteName:'My blog')+(contenList.category.name?'|'+contenList.category.name:''),
                meta: [
                { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:'My blog')+(contenList.category.keywords?','+contenList.category.keywords:'') },
                { hid: 'description', name: 'description', content: contenList.category.description?contenList.category.description:this.webconfig.siteDescription?this.webconfig.siteDescription:'' }
                ]
            }
        },
        async asyncData({ store, params, query, error }){
            if(store.state.webconfig && Object.keys(store.state.webconfig).length===0){
                const  [webconfig]  = await Promise.all([store.dispatch('_webconfig')])
                if(webconfig.status === 200) store.commit('setWebConfig',webconfig.data)
            }
            if(store.state.category && store.state.category.length===0){
                const  [category]  = await Promise.all([store.dispatch('_category')])
                if(category.status === 200) store.commit('setCategory',category.data)
            }
            if(store.state.rightAd && store.state.rightAd.length===0){
                const  [rightAd]  = await Promise.all([store.dispatch('_rightAd')])
                if(rightAd.status === 200) store.commit('setRightAd',rightAd.data)
            }
            if(store.state.tags && store.state.tags.length===0){
                const  [tags]  = await Promise.all([store.dispatch('_tags')])
                if(tags.status === 200) store.commit('setTags',tags.data)
            }
            const  [content]  = await Promise.all([store.dispatch('_content',{
                paginate:pageSize,
                page:query.page,
                category_id:params.id,
                tag:query.tag,
                search:query.search,
                })])
            if(content.status === 200) {
                contenList.data = content.data
                contenList.paginate = content.paginate
                store.commit('setContentList',content.data)
            }else{
                contenList.data = []
                contenList.paginate = {}
            }

            if(params.id){
                let cateoryData = findNodes(store.state.category,params.id)
                if(cateoryData.length){
                    contenList.category = cateoryData[0]
                }
            }
            contenList.search = query.search?query.search:'';
            contenList.tag = query.tag?query.tag:''
            return contenList
        }

    }
</script>