<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-03-31 17:14:46
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <a-row class="crumb" v-if="Object.keys(category).length>0 || tag || search">
            <div v-if='category.id'>
                <a-col :xs='24' :sm='24' :md='14' :lg='16' :xl='18'>
                    <div v-if='tag || search'>{{tag?`Tag:${tag}...`:(search?`Search:${search}...`:$t("lang.newest"))}}</div>
                    <a-breadcrumb  v-else>
                        <a-breadcrumb-item>
                            <nuxt-link :to="{path:'/'+locale}" ><a-icon type="home" /><span> {{$t('lang.home')}}</span></nuxt-link>
                        </a-breadcrumb-item>
                        <a-breadcrumb-item v-if="Object.keys(topCategory).length>0">
                            <nuxt-link :to="{path:'/'+locale+'/'+topCategory.module+'/'+topCategory.id}">
                                <a-icon v-if="topCategory.icon" :type="topCategory.icon" />
                                <span> {{topCategory.name}}</span>
                            </nuxt-link>
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                </a-col>
                <a-col :xs='24' :sm='24' :md='10' :lg='8' :xl='6'>
                    <a-input-search size="large" placeholder="Search..." @search="onSearch" />
                </a-col>
            </div>
            <div v-else-if='tag || search'>
                <div>
                    <a-col :xs='24' :sm='24' :md='12' :lg='10' :xl='8'>
                        <a-input-search 
                        size="large" 
                        placeholder="Search..."  
                        @search="onSearch" 
                        enterButton="Search"
                        />
                    </a-col>
                    <a-col :span='24'>
                        <Tags :url="'/search/'"/>
                    </a-col>
                </div>
            </div>
            <div v-else>{{$t("lang.newest")}}</div>
            <a-col :span='24'><a-divider/></a-col>
        </a-row>
        <a-list 
        itemLayout="horizontal" 
        :dataSource="data"
        >         
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta>
                    <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/'+'detail/'+item.id}" slot="title" class= "list-title">
                    {{item.title}}
                    </nuxt-link>
                    <div v-if="item.cover" slot="avatar">
                        <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/'+'detail/'+item.id}">
                            <img :src="item.cover" :alt="item.title" :title="item.title"/>
                        </nuxt-link>    
                    </div>
                    <div slot="description" class= "list-context">
                        <div class="list-icon">
                            <span><a-icon type="calendar" /> {{item.create_time.slice(0,10)}}</span>
                            <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/'+item.category_id}" class="list-link">
                                <a-icon :type="item.category_icon?item.category_icon:'folder'" /> {{item.category_name}}
                            </nuxt-link>
                            <span><a-icon type="fire" /> {{item.click}}</span>
                        </div>
                        <div class="description">{{item.description}}</div>
                    </div>
                </a-list-item-meta>
                </a-skeleton>
            </a-list-item>
        </a-list>
        <a-pagination 
        v-if="Object.keys(paginate).length>0"
        class="center"
        :current="paginate.page?paginate.page:1" 
        :total="paginate.total?paginate.total:1" 
        :itemRender="paginateRender"
        />
    </div>
</template>
<script>
    import Tags from '@/components/common/Tags';
    import {i18n}  from "@/config"
    export default {
        name: 'ArticleList',
        components:{Tags},
        data () {
            return {
                locale:this.$i18n.locale,
            }
        },
        methods: {
            onSearch(value) {
                this.$router.push(this.$route.path+'?search='+value)    
            },
            paginateRender(page, type, originalElement){
                if (type === "page") {
                    return <nuxt-link to={'/'+this.locale+'/'+(this.category.url?this.category.module:(this.search?'/search/':'article'))+'/'+(this.category.id?this.category.id:'')+'?page='+page+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}>{page}</nuxt-link>;
                } else if (type === "prev") {
                    return <nuxt-link to={'/'+this.locale+'/'+(this.category.url?this.category.module:(this.search?'/search/':'article'))+'/'+(this.category.id?this.category.id:'')+'?page='+(this.paginate.page===1?1:this.paginate.page-1)+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}><a-icon type="left"/></nuxt-link>;
                } else if (type === "next") {
                    return <nuxt-link to={'/'+this.locale+'/'+(this.category.url?this.category.module:(this.search?'/search/':'article'))+'/'+(this.category.id?this.category.id:'')+'?page='+(page<(this.paginate.total/this.paginate.per_page)?this.paginate.page+1:page)+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}><a-icon type="right"/></nuxt-link>;
                }
                return originalElement;
            },
        },  
        props:{
            data: {
                type: Array,
                default: ()=>[]
            },
            paginate: {
                type: Object,
                default:()=> {return {}}
            },
            tag: {
                type: String,
                default: ''
            },
            search: {
                type: String,
                default: ''
            },
            category: {
                type: Object,
                default:()=> {return {}}
            },
            topCategory: {
                type: Object,
                default: ()=>{return {}}
            },
        }
    }
</script>
<style lang='less' scoped>
    .crumb{
            font-size: 1rem;
            padding: 0 .8rem;
            line-height: 3rem;
            a{
                font-size: 1rem;
            }
            .ant-breadcrumb{
                line-height: 3rem;
            } 
        }
    .list-header{
        font-size:1rem;
        margin: 0 1rem;
    }
    .list-title{
        font-size: 1.2rem;
        color: rgba(37, 39, 39, 0.6);
        margin: 0 1rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .list-context{
        font-size: 1.0rem;
        line-height: 1.6rem;
        color:#777;
        padding: 0.1rem 1rem;
        .description{
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
            color: rgba(0, 0, 0, 0.55);
            line-height: 1.5rem;
        }
    }
    .ant-list-item-meta-avatar{
        img{
            width: 10.8rem;
            height: 8.1rem;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            border-radius: .3rem;
        }
    } 
    .list-icon{
        padding-bottom:.2rem;
        color:#AAA;
        font-size: 1rem;
        span{
            display: inline-block;  
        }
        .list-link{
            color:#AAA;
            display: inline-block; 
            margin: 0 1rem; 
        }
    }

    .ant-pagination-item a{
        padding: 0.5rem;
        margin: 0;
    }
    .center{
        text-align: center;
        margin-bottom: 1rem;
    }
    .ant-skeleton{
        margin: 1rem;
        ul{
            padding: 0
        }
    }
    @media only screen and (max-width:750px),
    only screen and (max-device-width:750px) {
        .ant-list-item-meta-avatar{
        img{
            width: 4rem;
            height: 3rem;
            }
        }
        .list-context{
            margin: 0 .3rem;
            padding: 0.1rem .3rem;
            font-size: 0.8rem;
            .description{
                line-height: 1rem;
            }
        }
        .list-title{
            margin: 0 .3rem;
            font-size: 1rem;
        }
        .list-icon{
            font-size: 0.8rem;
        }
    }
    .ant-divider{
        margin: .5rem 0;
    }
</style>