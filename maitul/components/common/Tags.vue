<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-16 10:31:22
 * @LastEditTime: 2020-02-28 14:00:47
 * @LastEditors: Xuannan
 -->
<template>
    <a-spin  :spinning="spinning" size="large" tip="Loading...">
        <div style="margin:0.8rem">
            <a-tag 
            style="margin: 0 0.5rem 0.5rem 0"
            v-for="tag in tags" 
            :key="tag.id" 
            :color="tagColor[Math.floor((Math.random()*tagColor.length))]"
            >
                <nuxt-link :to="{path:'/product?tag='+tag.name}">{{tag.name}}</nuxt-link>
            </a-tag>
        </div>
        
    </a-spin>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
                spinning: true,
            }
        },
        created(){
            this.spinning=false;
        },
        name: 'Tags',
        computed:mapState(["tags"]),
    };
</script>
<style  lang="less" scoped>

</style>