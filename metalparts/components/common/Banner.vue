<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-16 10:31:22
 * @LastEditTime: 2020-03-20 10:27:29
 * @LastEditors: Xuannan
 -->
<template>
    <div v-if="adspace[banner]">
        <a-carousel arrows :style="{ backgroundImage: 'url('+(adspace[banner].length?adspace[banner][0].img:'')+')'}">
            <div
            slot="prevArrow"
            slot-scope="props"
            class="custom-slick-arrow"
            style="left: 1.5rem;zIndex: 1"
            >
            <a-icon type="left" />
            </div>
            <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 1.5rem">
            <a-icon type="right" />
            </div>
                <div v-for="item in adspace[banner]" :key="item.id" class='banner' :style="{ backgroundImage: 'url('+item.img+')'}">
                    <div class='shade'> </div>
                    <div class='info'>
                        <h1>{{item.name}}</h1>
                        <p>{{item.info}}</p>
                        <a-button  target="_blank" :href="item.url" type="primary">Learn More</a-button>
                    </div>        
                </div>
        </a-carousel>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {siteInfo}  from "@/service/config";
    export default {
        name: 'Banner',
        data() {
            return {
                banner:siteInfo.banner
            }
        },
        computed:mapState(["adspace"]),
    };
</script>
<style  lang="less" scoped>
    .ant-carousel {   
        line-height: 0;
        overflow: hidden;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
        background-color: rgba(0, 0, 0, 0.35);
       .custom-slick-arrow {
            width: 2rem;
            height: 2rem;
            font-size: 2rem;
            color: #fff;
            background-color: transparent;
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
        height: 24rem;
        line-height: 24rem;
        overflow: hidden;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
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
            padding-left: 12rem;
            margin-top:7.2rem;
            h1{
                margin-bottom: 0.5rem;
                color: #fff !important;
                font-size: 2rem;
                }
            p{
                margin-bottom: 0.5rem;
                font-size: 1rem;
                color: #fff !important;
                }
            a{
                float:left;
                }
            }
        }
    @media only screen and (max-width:750px),
    only screen and (max-device-width:750px) {
        .banner{
            height: 8rem;
            .info{
                display: none;
            }
        }
        
    }
</style>