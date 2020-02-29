<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-25 19:25:28
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <a-list 
        itemLayout="horizontal" 
        :dataSource="data"
        >         
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-skeleton :loading="skeletonLoading" active avatar>
                <a-list-item-meta>
                    <nuxt-link :to="{path:'/detail/'+item.id}" slot="title" class= "list-title">
                    {{item.title}}
                    </nuxt-link>
                    <div v-if="item.cover" slot="avatar">
                        <nuxt-link :to="{path:'/detail/'+item.id}">
                            <img :src="item.cover" :alt="item.title" :title="item.title"/>
                        </nuxt-link>    
                    </div>
                    <!-- <a-avatar v-if="item.cover"
                     slot="avatar"
                    :src="item.cover"
                    /> -->
                    <div slot="description" class= "list-context">
                        <div class="list-icon">
                            <span><a-icon type="calendar" /> {{item.create_time.slice(0,10)}}</span>
                            <span><a-icon type="fire" /> {{item.click}}人</span>
                        </div>
                        <div class="description">{{item.description}}</div>
                    </div>
                </a-list-item-meta>
                </a-skeleton>
            </a-list-item>
        </a-list>
        <a-pagination 
        class="center"
        :current="paginate.page?paginate.page:1" 
        :total="paginate.total?paginate.total:1" 
        :itemRender="paginateRender"
        />
    </div>
</template>
<script>
    export default {
        name: 'ArticleList',
        data() {
            return {
                skeletonLoading:true,
            }
        },
        methods: {
            paginateRender(page, type, originalElement){
                if (type === "page") {
                    return <nuxt-link to={'/list/'+(this.category.id?this.category.id:'')+'?page='+page+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}>{page}</nuxt-link>;
                } else if (type === "prev") {
                    return <nuxt-link to={'/list/'+(this.category.id?this.category.id:'')+'?page='+(this.paginate.page-1)+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}>上一页</nuxt-link>;
                } else if (type === "next") {
                    return <nuxt-link to={'/list/'+(this.category.id?this.category.id:'')+'?page='+(this.paginate.page+1)+(this.search?('&search='+this.search):'')+(this.tag?('&tag='+this.tag):'')}>下一页</nuxt-link>;
                }
                return originalElement;
            },
        },  
        mounted(){
           this.skeletonLoading=false;
        },
        beforeUpdate() {
            this.skeletonLoading=true;
        },
        updated() {
            this.skeletonLoading=false;
        },
        props:{
            data: {
                type: Array,
                default: ()=>[]
            },
            paginate: {
                type: Object,
                default:()=> {}
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
                type: String,
                default: ''
            },
        }
    }
</script>
<style lang='less' scoped>
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
</style>