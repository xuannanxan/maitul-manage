<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-26 20:05:32
 * @LastEditors: Xuannan
 -->
<template>
    <div class="contact-right">
        <a-tooltip placement="left" v-if="webconfig.contact">
            <template slot="title">
            <span>{{webconfig.contact}}</span>
            </template>
            <div class="right-btn">
                <a :href="'tel:'+webconfig.contact"><a-icon type="mobile" /></a>
            </div>
            
        </a-tooltip>
        <a-tooltip placement="left" v-if="webconfig.email">
            <template slot="title">
            <span>{{webconfig.email}}</span>
            </template>
            <div class="right-btn" >
                <a :href="'mailto:'+webconfig.email"><a-icon type="mail" /></a>
            </div>
            
        </a-tooltip>
        <a-popover placement="left" trigger="click" v-if="webconfig.weixin">
            <template slot="content">
            <img :src="webconfig.weixin" alt="wechat" title="wechat" style="width:150px">
            </template>
            <div class="right-btn"><a-icon type="wechat" /></div>
        </a-popover>
    </div>
</template>
<script>
  export default {
    name: 'RightContact',
    data () {
        return {
            webconfig: this.$store.state.webconfig
        }
    },
  };
</script>
<style lang="less" scoped>
    .contact-right{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 2;
        position: fixed;
        right: 2rem;
        bottom: 200px;
        z-index: 10;
        cursor: pointer;
        .right-btn{
            margin-top: 1rem;
            color: #fff;
            a{
                color: #fff;
                padding: .5rem;
            }
        }
    }
    

</style>