<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-04-08 10:43:31
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <div v-if="relatedList.length">
            <div class="related">
                <span>{{$t('lang.relatedArticle')}}</span>
            </div>
            <a-row>
                <a-list 
                itemLayout="horizontal" 
                :dataSource="relatedList"
                >         
                    <a-list-item slot="renderItem" slot-scope="item">
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
                    </a-list-item>
                </a-list>
            </a-row>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'RelatedArticle',
        computed:mapState(["relatedList"]),
        data () {
            return {
                locale:this.$i18n.locale,
            }
        },
    }
</script>
<style lang='less' scoped>
    .related{
        margin: 1rem 0;
        padding: .6rem 1rem;
        font-size: 1.1rem;
        font-weight: 500;
        background-color: #f1f1f1;
        span{
            padding: 0 .6rem;
            border-left: 3px solid #00cccc;
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

    .center{
        text-align: center;
        margin-bottom: 1rem;
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