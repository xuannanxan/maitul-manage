<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-29 23:40:17
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <a-skeleton :loading="skeletonLoading" :title="false" active avatar>
        <div v-if="data.length">
            <a-tabs :defaultActiveKey='data[0].id' size="large">
                <a-tab-pane v-for="item in data" :tab="item.title" :key="item.id">
                    <a-row>
                        <a-col v-if="item.cover" :xs='24' :sm='24' :md='10' :lg='10' :xl='10'>
                            <div class="tab-cover" >
                                <div :style="{ backgroundImage: 'url('+item.cover+')'}" :title="item.title"></div>        
                            </div>
                        </a-col>
                        <a-col v-if="item.cover" :xs='24' :sm='24' :md='14' :lg='14' :xl='14'>
                            <div :class="maxHeight?'tab-content':''">
                                <div  v-html="item.content"></div>
                            </div>
                        </a-col>
                        <a-col v-else :span='24'>
                            <div :class="maxHeight?'tab-content':''">
                                <div  v-html="item.content"></div>
                            </div>
                        </a-col>
                    </a-row>
                </a-tab-pane>
            </a-tabs> 
        </div>
        <div v-else>
            <div></div>
        </div>
        </a-skeleton>
    </div>
</template>
<script>
    export default {
        name: 'Info',
        data() {
            return {
                skeletonLoading:true,
            }
        },
        created(){
           this.skeletonLoading=false;
        },
        props:{
                data: {
                    type: Array,
                    default: ()=>[]
                },
                maxHeight: {
                    type: Boolean,
                    default:true,
                },
            }
    }
</script>
<style lang='less' scoped>
    .tab-cover{
        padding-right: 1.2rem;
        div{
            width: 100%;
            height: 16.5rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;
            position: relative;
            transition: all 2s;
        }
    }
    .tab-content{
        div{
            height: 16.5rem;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 11;
            line-clamp: 11;
            -webkit-box-orient: vertical;
        }
            
    }
    @media only screen and (max-width:750px),
    only screen and (max-device-width:750px) {
        .tab-cover{
            padding:0 .8em;
        }
        .tab-content{
            padding:.5rem .8em 1rem .8em;
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