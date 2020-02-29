<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-29 22:13:57
 * @LastEditors: Xuannan
 -->
<template>
    <a-skeleton :loading="skeletonLoading" :title="false" active avatar>
        <a-empty class="no-content" v-if="Object.keys(data).length===0">
            <span slot="description">
                <div>
                    <h3>Sorry!</h3>
                    <h1>No Data...</h1>
                    <p>Please contact us at <a href="mailto:admin@maitul.com">admin@maitul.com</a></p>
                    <nuxt-link to="/"> Home</nuxt-link>
                </div>
            </span>
        </a-empty>
        <a-row v-else>
            <a-col :span='24' style="padding:.3rem 0">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <nuxt-link to="/"><a-icon type="home" /><span> Home</span></nuxt-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>
                        <nuxt-link :to="{path:data.category_url+data.category_id}">
                            <a-icon :type="data.category_icon" />
                            <span> {{data.category_name}}</span>
                        </nuxt-link>
                    </a-breadcrumb-item>
                </a-breadcrumb>
                <a-col :xs='0' :sm='0' :md='24' :lg='24' :xl='24'><a-divider/></a-col>
            </a-col>
            <a-col :xs='24' :sm='24' :md='10' :lg='10' :xl='10'>
                <div  class="cover">
                    <img v-if="data.cover" :src="data.cover" :alt="data.title" :title="data.title">
                    <img
                    v-else
                    :alt="data.title"
                    :title="data.title"
                    src="~/assets/images/logo.png"
                    />
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :md='14' :lg='14' :xl='14'  class="detail-info">
                <h1>{{data.title}}</h1>
                <a-divider/>
                <div class="detail-tag" v-if="data.tags_name">
                    <a-tag v-for="(item,index) in data.tags_name.split(',')" :key="index+item" :color="tagColor[Math.floor((Math.random()*tagColor.length))]">
                        <nuxt-link :to="{path:data.category_url+'?tag='+item}">{{item}}</nuxt-link>
                    </a-tag>
                </div>
                <p>{{data.description}}</p>
                <div style="margin:1.2rem 0;">
                    <Message/>
                </div>
            </a-col>
            <a-col :span='24'>
                <div class="detail-content" v-html="data.content"></div>
            </a-col>
            <a-col :span='24'>
                <RelatedProduct/>
            </a-col>
        </a-row>
    </a-skeleton>
</template>
<script>
    import Contact from '../common/Contact.vue'
    import Message from '../common/Message.vue'
    import RelatedProduct from '../common/RelatedProduct.vue'
    import {mapState} from 'vuex'
    export default {
        components:{Contact,Message,RelatedProduct},
        name: 'Product',
        data() {
            return {
                tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
                skeletonLoading:true,
            }
        },
        created(){
           this.skeletonLoading=false;
        },
        props:["data"],
        computed:{
            ...mapState(["webconfig"]),
        },
    }
</script>
<style lang='less' scoped>
    .no-content{
        margin: 5rem;
    }
    .cover{
        padding:1rem 1rem;
        
        border: 1px solid #ccc;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;

        overflow:hidden;
        img{
            width:100%;
            transition: all 2s;
        }
        img:hover{
            
            transform:scale(1.2);   //图片放大的倍数
        }
        
    }
    .cover:hover{
            border: 1px solid #00cccc;
        }
    .detail-info{
        padding:0 1rem;
        .tag{
        padding-bottom: .5rem;
            .ant-tag {
                margin: 0px 0.5rem 0.5rem 0px;
            }
        }
        p{
            font-size: 1rem;
        }
        .email{
            margin-top: .8rem;
            a{
                font-size: 1.2rem;
                color: rgba(0, 0, 0, 0.65);
                font-weight: 500;
            }
            a:hover{
                color: #00cccc;
            }
        }
        
    }
    .detail-content{
            font-size: 1.0rem;
            line-height: 1.6rem;
            color:#777;
            padding: 0.1rem 1rem;
            img{
                width:100%;
                border-radius: .3rem;
            }
        }
    .ant-skeleton{
        padding:  1rem;
        ul{
            padding: 0
        }
    }
</style>