<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-17 10:23:14
 * @LastEditTime: 2020-03-16 21:35:15
 * @LastEditors: Xuannan
 -->
<template>
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
                <a-divider>  
                    <div class="detail-icon">
                        <span><a-icon type="calendar" /> {{data.create_time.slice(0,10)}}</span>
                        <nuxt-link :to="{path:'/list/'+data.category_id}" class="list-link">
                            <a-icon :type="data.category_icon?data.category_icon:'folder'" /> {{data.category_name}}
                        </nuxt-link>
                        <span><a-icon type="fire" /> {{data.click}}人</span>
                        <nuxt-link :to="{path:data.source_url}" class="list-link" v-if="data.source">
                            <a-icon type="import" /> {{data.source}}
                        </nuxt-link>
                    </div>
                </a-divider>
                
                <div class="detail-tag" v-if="data.tags_name">
                    <a-tag v-for="(item,index) in data.tags_name.split(',')" :key="index+item" :color="tagColor[Math.floor((Math.random()*tagColor.length))]">
                        <nuxt-link :to="{path:'/list?tag='+item}">{{item}}</nuxt-link>
                    </a-tag>
                </div>
                <div class="detail-content" v-html="data.content"></div>
            </div>
                
                
        </div>
</template>
<script>
    export default {
        name: 'Content',
        data() {
            return {
                tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
            }
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