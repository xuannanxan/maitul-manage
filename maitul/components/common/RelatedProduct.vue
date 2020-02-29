<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-29 15:07:26
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <div class="related">
            <span>Related Product...</span>
        </div>
        <a-row  v-if="productList.length">
            <a-col 
            :xs='24' :sm='24' :md='12' :lg='6' :xl='6'
            v-for="item in productList" 
            :key="item.id"
            class="product"
            :title="item.title"
            >
            <a-skeleton :loading="skeletonLoading" active avatar>
            <nuxt-link :to="{path:'/product/detail/'+item.id}">
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
                        <template slot="title"><span>{{item.title}}</span></template>
                    </a-card-meta>
                </a-card>
                </nuxt-link>
                </a-skeleton>
            </a-col>
       
        </a-row>
             <div v-else :span="24">
            <a-empty/>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'RelatedProduct',
        data() {
            return {
                skeletonLoading:true,
            }
        },
         
        mounted(){
           this.skeletonLoading=false;
        },
        computed:mapState(["productList"])
    }
</script>
<style lang='less' scoped>
    .product{
        padding: .8rem;
        span{
            color: rgba(0, 0, 0, 0.65);
        }
        :hover span{
            color: #00cccc;
        }
        .cover,img{
            height: 10rem;
            line-height: 10rem;
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