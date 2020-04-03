<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-04-03 13:01:19
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <a-row class="crumb" v-if="Object.keys(category).length>0 || tag || search">
            <a-col :xs='24' :sm='24' :md='14' :lg='16' :xl='18'>
                <div v-if='tag || search'>{{tag?`Tag:${tag}...`:(search?`Search:${search}...`:$t("lang.newest"))}}</div>
                    <a-breadcrumb v-else-if='category.id' >
                        <a-breadcrumb-item>
                            <nuxt-link :to="{path:'/'+locale}" ><a-icon type="home" /><span> {{$t('lang.home')}}</span></nuxt-link>
                        </a-breadcrumb-item>
                        <a-breadcrumb-item v-if="Object.keys(topCategory).length>0">
                            <nuxt-link :to="{path:'/'+locale+'/'+topCategory.module+'/'+topCategory.id}">
                                <a-icon v-if="topCategory.icon"  :type="topCategory.icon" />
                                <span> {{topCategory.name}}</span>
                            </nuxt-link>
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                <div v-else>Newest...</div>
            </a-col>
            <a-col :xs='24' :sm='24' :md='10' :lg='8' :xl='6'>
                <a-input-search size="large" placeholder="Search..." @search="onSearch" />
            </a-col>
            <a-col :span='24'><a-divider/></a-col>
        </a-row>
        <a-row>
            <div style="margin:.5rem .8rem" v-if="Object.keys(topCategory).length>0">
                <Tags :url="'/'+locale+'/'+topCategory.module"/>
            </div>
        </a-row>
        <a-row  v-if="data.length">
            <a-col 
            :xs='24' :sm='24' :md='12' :lg='8' :xl='6'
            v-for="item in data" 
            :key="item.id"
            class="product"
            :title="item.title"
            >
            <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/'+'detail/'+item.id}">
                <a-card  hoverable >
                    <div v-if="item.cover" slot="cover" class="cover" :style="{ backgroundImage: 'url('+item.cover+')'}"></div>
                    <img
                    v-else
                    :alt="item.title"
                    :title="item.title"
                    src="~/assets/images/logo.png"
                    slot="cover"
                    />
                    <a-card-meta>
                        <template slot="description">
                            <div class="list-icon">
                                <span><a-icon :type="item.category_icon?item.category_icon:'folder'" /> {{item.category_name}}</span>
                                <span><a-icon type="fire" /> {{item.click}}</span>
                            </div>
                            <span class="description">
                                {{item.description}}
                            </span>
                        </template>
                        <template slot="title"><span>{{item.title}}</span></template>
                    </a-card-meta>
                </a-card>
                </nuxt-link>
            </a-col>
        </a-row>
        <div v-else :span="24">
            <a-empty/>
        </div>
        <a-row>
            <a-pagination v-if="Object.keys(paginate).length>0"
            class="center"
            :current="paginate.page?paginate.page:1" 
            :total="paginate.total?paginate.total:1" 
            :itemRender="paginateRender"
            />
        </a-row>
    </div>
</template>
<script>
    import Tags from '../common/Tags'
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
                    return <nuxt-link to={(this.category.url?this.category.url:'/'+this.locale+'/product/'+(this.category.id?this.category.id:''))+'?page='+page+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}>{page}</nuxt-link>;
                } else if (type === "prev") {
                    return <nuxt-link to={(this.category.url?this.category.url:'/'+this.locale+'/product/'+(this.category.id?this.category.id:''))+'?page='+(this.paginate.page===1?1:this.paginate.page-1)+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}><a-icon type="left" /></nuxt-link>;
                } else if (type === "next") {
                    return <nuxt-link to={(this.category.url?this.category.url:'/'+this.locale+'/product/'+(this.category.id?this.category.id:''))+'?page='+(page<(this.paginate.total/this.paginate.per_page)?this.paginate.page+1:page)+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}><a-icon type="right" /></nuxt-link>;
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
                default: ()=>{return {}}
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
                default: ()=>{return {}}
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
    
    .product{
        padding: .8rem;
        .description{
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            color: rgba(0, 0, 0, 0.55);
            min-height: 2.6rem;
        }
        span{
            color: rgba(0, 0, 0, 0.65);
        }
        :hover span{
            color: #00cccc;
        }
        .cover,img{
            height: 12rem;
            line-height: 12rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;
            position: relative;
            transition: all 2s;
        }
        :hover .cover,:hover img{
                transform:scale(1.2);   //图片放大的倍数
            }
    }

    .list-icon{
        font-size: .9rem;
        color: rgba(0, 0, 0, 0.33);
        span{
            display: inline-block;  
            max-width:150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: .3rem;
        }
    }
    .list-tag{
        padding-bottom: .5rem;
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
    .ant-divider{
        margin: .5rem 0;
    }
</style>