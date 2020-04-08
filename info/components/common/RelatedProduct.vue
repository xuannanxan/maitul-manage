<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-03-31 15:20:00
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <div v-if="relatedList.length">
            <div class="related">
                <span>{{$t('lang.relatedProduct')}}</span>
            </div>
            <a-row>
                <a-col 
                :xs='24' :sm='24' :md='12' :lg='6' :xl='6'
                v-for="item in relatedList" 
                :key="item.id"
                class="product"
                :title="item.title"
                >
                <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/detail/'+item.id}">
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
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'RelatedProduct',
        computed:mapState(["relatedList"]),
        data () {
            return {
                locale:this.$i18n.locale,
            }
        },
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
</style>