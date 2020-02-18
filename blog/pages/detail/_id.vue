<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 19:34:49
 * @LastEditTime: 2020-02-18 21:50:37
 * @LastEditors: Xuannan
 -->
<template>
    <a-layout class="layout ">
        <Header :currentCategory="content.category_id"/>
        <a-layout-content class="content">
        <a-row>
            <a-col :xs='24' :sm='24' :md='18' :lg='18' :xl='18'>
            <div class="main">
                <Content :data="content"/>
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
                        <RightList/>
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
    import ArticleList from '@/components/list/ArticleList';
    import Content from '@/components/detail/Content';
    import RightList from '@/components/common/RightList';
    import {mapState} from 'vuex'
    const pageSize = 10;
    const contenData =  {
        content:{},
        };
    export default {
        scrollToTop: true,
        components:{Header,Author,RightAd,ArticleList,Content,RightList},
        computed:mapState(["rightAd","webconfig"]),
        head () {
            return {
                title: (this.webconfig.siteName?this.webconfig.siteName:'My blog')+(contenData.content.title?'|'+contenData.content.title:''),
                meta: [
                { hid: 'keywords', name: 'keywords', content: (this.webconfig.siteKeywords?this.webconfig.siteKeywords:'My blog')+(contenData.content.keywords?','+contenData.content.keywords:'') },
                { hid: 'description', name: 'description', content: contenData.content.description?contenData.content.description:this.webconfig.siteDescription?this.webconfig.siteDescription:'' }
                ]
            }
        },
        async asyncData({ store, params, error }){
            if(Object.keys(store.state.webconfig).length===0){
                const  [webconfig]  = await Promise.all([store.dispatch('_webconfig')])
                if(webconfig.status === 200) store.commit('setWebConfig',webconfig.data)
            }
            if(store.state.category.length===0){
                const  [category]  = await Promise.all([store.dispatch('_category')])
                if(category.status === 200) store.commit('setCategory',category.data)
            }
            if(store.state.rightAd.length===0){
                const  [rightAd]  = await Promise.all([store.dispatch('_rightAd')])
                if(rightAd.status === 200) store.commit('setRightAd',rightAd.data)
            }
            //没有内容列表重新从服务器获取
            if(store.state.contentList.length===0){
                const  [content]  = await Promise.all([store.dispatch('_content',{paginate:pageSize})])
                if(content.status === 200) {
                    store.commit('setContentList',content.data)
                }
            }
            //重复点击同一个内容，不访问服务器，否则从服务器获取数据更新
            if(Object.keys(store.state.content).length > 0 && store.state.content.id ===params.id){
                contenData.content = store.state.content
            }else{
                const  [content]  = await Promise.all([store.dispatch('_content',{id:params.id})])
                if(content.status === 200) {
                    contenData.content = content.data
                    store.commit('setContent',content.data)
                }
            }
            return contenData
        }

    }
</script>