<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-16 10:31:22
 * @LastEditTime: 2020-02-18 16:33:47
 * @LastEditors: Xuannan
 -->
<template>
    <a-spin  :spinning="spinning" size="large" tip="Loading...">
        <a-carousel arrows>
            <div
            slot="prevArrow"
            slot-scope="props"
            class="custom-slick-arrow"
            style="left: 10px;zIndex: 1"
            >
            <a-icon type="left" />
            </div>
            <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
            <a-icon type="right" />
            </div>
                <div v-for="item in banner" :key="item.id" class='banner' :style="{ backgroundImage: 'url('+item.img+')'}">
                    <div class='shade'> </div>
                    <div class='info'>
                        <h1>{{item.name}}</h1>
                        <p>{{item.info}}</p>
                        <a-button  target="_blank" :href="item.url" type="primary" size='large'>Learn More</a-button>
                    </div>
                </div>
        </a-carousel>
    </a-spin>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                spinning: true,
            }
        },
        mounted(){
            this.spinning=false;
        },
        name: 'Banner',
        computed:mapState(["banner"]),
    };
</script>
<style  lang="less" scoped>
    .ant-carousel {   
        line-height: 0;
       .custom-slick-arrow {
            width: 2rem;
            height: 2rem;
            font-size: 2rem;
            color: #fff;
            background-color: rgba(31, 45, 61, 0.11);
            opacity: 0.3;
        }
        .custom-slick-arrow:before {
            display: none;
        }
        .custom-slick-arrow:hover {
            opacity: 0.8;
        }
    }
 
    .banner{
        text-align: center;
        height: 19rem;
        line-height: 19rem;
        overflow: hidden;
        border-radius: .5rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
        border-radius: .5rem;
        .shade{
            height: 100%;
            background-color: #000000;
            opacity:0.3;
        }
        .info {
            position: absolute; 
            top: 0px; 
            text-align:left;
            line-height: 2.5rem;
            padding-left: 5rem;
            h1{
                margin-top:7.2rem;
                margin-bottom: 0.5rem;
                color: #fff !important;
                font-size: 2.5rem;
                }
            p{
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
                color: #fff !important;
                }
            a{
                float:left;
                }
            }
        }
</style>