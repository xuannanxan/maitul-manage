<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-22 20:56:32
 * @LastEditors: Xuannan
 -->
<template>
    <a-tabs :defaultActiveKey='about[0].id' size="large">
        <a-tab-pane v-for="item in about" :tab="item.title" :key="item.id">
            <a-row>
                <a-col v-if="item.cover" :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
                    <img class="tab-cover" :src="item.cover" :alt="item.title">
                </a-col>
                <a-col v-if="item.cover" :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
                    <div class="tab-content" v-html="item.content"></div>
                </a-col>
                <a-col v-else :span='24'>
                    <div v-html="item.content"></div>
                </a-col>
            </a-row>
        </a-tab-pane>
    </a-tabs>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'About',
        computed:{
            ...mapState(["about"]),
        },
        data() {
            return {
                skeletonLoading:true,
            }
        },
        mounted(){
           this.skeletonLoading=false;
        },
    }
</script>
<style lang='less' scoped>
    .tab-cover{
        width: 100%;
        padding-right: 1.5em;
    }
    @media only screen and (max-width:750px),
    only screen and (max-device-width:750px) {
        .tab-cover{
            padding:0 .8em;
        }
        .tab-content{
            padding:.5rem .8em 0 .8em;
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
    .list-header{
        font-size:1rem;
        margin: 0 1rem;
    }
    .list-title{
        font-size: 1.2rem;
        color: rgba(37, 39, 39, 0.6);
        margin: 0 1rem;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
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
        font-size: .9rem;
        color: rgba(0, 0, 0, 0.33);
        span{
            display: inline-block;  
            max-width:150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: .3rem;
            line-height: 50%;
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
</style>