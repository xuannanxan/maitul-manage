<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-02-18 21:22:49
 * @LastEditors: Xuannan
 -->
<template>
    <a-skeleton :loading="skeletonLoading" :title="false" active>
        <div>
            <a-empty class="no-content" v-if="Object.keys(data).length===0">
                <span slot="description">
                <h3>Sorry!</h3>
                <h1>内容不存在...</h1>
                <p>Please contact us at <a href="mailto:admin@maitul.com">admin@maitul.com</a></p>
                <p><nuxt-link to="/"> 返回首页</nuxt-link></p>
                </span>
            </a-empty>
            <div class="detail" v-else>
                <h1 class="center">
                   {{data.title?data.title:'.....'}}
                </h1>
                <div class="detail-icon center">
                    <span><a-icon type="calendar" /> {{data.create_time}}</span>
                    <nuxt-link :to="{path:'/list/'+data.category_id}" class="list-link">
                        <a-icon :type="data.category_icon?data.category_icon:'folder'" /> {{data.category_name}}
                    </nuxt-link>
                    <span><a-icon type="fire" /> {{data.click}}人</span>
                </div>
                <div class="detail-tag" v-if="data.tags_name">
                    <a-tag v-for="(item,index) in data.tags_name.split(',')" :key="index+item" :color="tagColor[Math.floor((Math.random()*tagColor.length))]">
                        <nuxt-link :to="{path:'/list?tag='+item}">{{item}}</nuxt-link>
                    </a-tag>
                </div>
                <div class="detail-content" v-html="data.content">{{data.content}}</div>
            </div>
                
                
        </div>
        
    </a-skeleton>

</template>
<script>
    export default {
        name: 'Content',
        data() {
            return {
                tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
                skeletonLoading:true,
            }
        },

        mounted(){
           this.skeletonLoading=false;
        },
        props:["data"]
    }
</script>
<style lang='less' scoped>
    .no-content{
        margin: 5rem;
    }
    .detail{
        padding: 1rem;
        .center{
            text-align: center;
        }
        .detail-icon{
            padding-bottom:.2rem;
            color:#AAA;
            font-size: 1rem;
            span{
                display: inline-block;  
            }
            .list-link{
                color:#AAA;
                display: inline-block; 
                margin: 0 1rem; 
            }
        }
        .detail-tag{
            padding: .2rem 0;
        }
        .detail-context{
            font-size: 1.0rem;
            line-height: 1.6rem;
            color:#777;
            padding: 0.1rem 1rem;
            img{
                width:100%;
                border-radius: .3rem;
            }
        }
    }
    .ant-skeleton{
        padding:  1rem;
        ul{
            padding: 0
        }
    }
</style>