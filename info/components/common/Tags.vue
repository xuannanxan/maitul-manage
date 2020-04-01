<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-16 10:31:22
 * @LastEditTime: 2020-03-29 10:13:40
 * @LastEditors: Xuannan
 -->
<template>
        <div>
            <a-tag 
            style="margin: 0 0.5rem 0.5rem 0"
            v-for="tag in tags" 
            :key="tag" 
            :color="tagColor[Math.floor((Math.random()*tagColor.length))]"
            >
                <nuxt-link :to="{path:url+'?tag='+tag}">{{tag}}</nuxt-link>
            </a-tag>
        </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
            }
        },
        name: 'Tags',
        computed:mapState(["tags"]),
        props:{
            url: {
                type: String,
                default: '/product'
            },
        }
    };
</script>
<style  lang="less" scoped>

</style>