<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-19 16:23:12
 * @LastEditors: Xuannan
 -->
<template>
    <div>
        <a-list 
        itemLayout="horizontal" 
        :dataSource="contentList"
        size="small"
        >
            <div slot="header" class="list-header">  
                <div>相关推荐...</div>
            </div>           
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-skeleton :loading="skeletonLoading" :title="false" active>
                <a-list-item-meta>
                    <nuxt-link :to="{path:'/detail/'+item.id}" slot="description" class= "list-title">
                    {{item.title}}
                    </nuxt-link>
                </a-list-item-meta>
                </a-skeleton>
            </a-list-item>
        </a-list>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'RightList',
        data() {
            return {
                skeletonLoading:true,
            }
        }, 
        mounted(){
           this.skeletonLoading=false;
        },
        beforeUpdate() {
            this.skeletonLoading=true;
        },
        updated() {
            this.skeletonLoading=false;
        },
        computed:mapState(["contentList"])
    }
</script>
<style lang='less' scoped>
    .list-header{
        font-size:1rem;
        margin: 0 1rem;
    }
    .list-title{
        font-size: 1rem;
        color: rgba(37, 39, 39, 0.6);
        margin: 0 1rem;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
    }
    .ant-skeleton{
        margin: 0 1rem;
        ul{
            padding: 0 1rem
        }
    }

</style>