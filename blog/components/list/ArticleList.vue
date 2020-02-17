<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-17 10:23:14
 * @LastEditors: Xuannan
 -->
<template>
    <div>

        <a-list 
        itemLayout="horizontal" 
        :dataSource="data"
        >
            <div slot="header" class="list-header">
                
                <a-breadcrumb v-if='category.id' >
                    <a-breadcrumb-item>
                        <nuxt-link to="/"><a-icon type="home" /><span>首页</span></nuxt-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>
                        <nuxt-link :to="{path:'/list/'+category.id}">
                            <a-icon :type="category.icon" />
                            <span>{{category.name}}</span>
                        </nuxt-link>
                        
                    </a-breadcrumb-item>
                </a-breadcrumb>
                <div v-else>{{tag?`【${tag}】相关...`:(search?`【${search}】的搜索结果...`:'最新文章')}}</div>
            </div>
            
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-skeleton :loading="skeletonLoading" active avatar>
                <a-list-item-meta>
                    <nuxt-link :to="{path:'/detail/'+item.id}" slot="title" class= "list-title">
                    {{item.title}}
                    </nuxt-link>
                    <div slot="description" class= "list-context">
                        <div class="list-icon">
                            <span><a-icon type="calendar" /> {{item.create_time}}</span>
                            <nuxt-link :to="{path:'/list/'+item.category_id}" class="list-link">
                                <a-icon :type="item.category_icon?item.category_icon:'folder'" /> {{item.category_name}}
                            </nuxt-link>
                            <span><a-icon type="fire" /> {{item.click}}人</span>
                        </div>
                        <div v-if="item.cover">
                            <nuxt-link :to="{path:'/detail/'+item.id}">
                                <img :src="item.cover" :alt="item.title" :title="item.title"/>
                            </nuxt-link>    
                        </div>
                        <div>{{item.description}}</div>
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
        props:["data","paginate","tag","search","category"]
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
    }
    .list-context{
        font-size: 1.0rem;
        line-height: 1.6rem;
        color:#777;
        padding: 0.1rem 1rem;
        img{
            width:100%;
            border-radius: .3rem;
        }
    }
    .list-icon{
        padding:.5rem 0;
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
        margin: 0 1rem;
        ul{
            padding: 0
        }
    }
</style>