<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-16 10:31:22
 * @LastEditTime: 2020-03-04 21:16:32
 * @LastEditors: Xuannan
 -->
<template>
        <div style="margin:0.8rem">
            <a-divider>按标签搜索</a-divider>
            <a-tag 
            style="margin: 0 0.5rem 0.5rem 0"
            v-for="tag in tags" 
            :key="tag.id" 
            :color="tagColor[Math.floor((Math.random()*tagColor.length))]"
            >
                <nuxt-link :to="{path:'/list?tag='+tag.name}">{{tag.name}}</nuxt-link>
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
    };
</script>
<style  lang="less" scoped>

</style>