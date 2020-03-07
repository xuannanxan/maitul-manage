<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 19:34:49
 * @LastEditTime: 2020-03-05 22:51:27
 * @LastEditors: Xuannan
 -->
<template>
    <a-layout class="layout ">
        <a-back-top>
            <a-button type="primary" shape="circle" icon="to-top" size='large'></a-button>
        </a-back-top>
        <Header :currentCategory="[content.category_id]"/>
        <a-layout-content class="content">
        <a-row>
            <a-col :xs='24' :sm='24' :md='18' :lg='18' :xl='18'>
                <a-col :span="24">
                    <div class="main">
                        <Content :data="content"/>
                    </div>
                </a-col>
                <a-col :span='24'>
                    <div class="main">
                        <Recommend/>
                    </div>
                </a-col>
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
        <a-layout-footer style="text-align: center">
            {{webconfig.siteFoot?webconfig.siteFoot:'My blog'}}
        </a-layout-footer>
    </a-layout>
</template>
<script>
    import Header from '@/components/common/Header';
    import Author from '@/components/common/Author';
    import RightAd from '@/components/common/RightAd';
    import ArticleList from '@/components/list/ArticleList';
    import Content from '@/components/detail/Content';
    import Tags from '@/components/common/Tags';
    import Recommend from '@/components/common/Recommend';
    import {mapState} from 'vuex'
    const pageSize = 10;
    const contenData =  {
        content:{},
        };
    export default {
        scrollToTop: true,
        components:{Header,Author,RightAd,ArticleList,Content,Recommend,Tags},
        computed:mapState(["rightAd","webconfig"]),
        head () {
            const siteTitle = this.webconfig.siteTitle?this.webconfig.siteTitle:(this.webconfig.siteName?this.webconfig.siteName:'My blog')
            const pageTitle = contenData.content.title?'|'+contenData.content.title:''
            return {
                title: siteTitle+pageTitle,
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
            if(store.state.tags && store.state.tags.length===0){
                const  [tags]  = await Promise.all([store.dispatch('_tags')])
                if(tags.status === 200) store.commit('setTags',tags.data)
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