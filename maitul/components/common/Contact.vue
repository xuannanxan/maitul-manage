<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-27 19:54:29
 * @LastEditors: Xuannan
 -->
<template>
    <div class="contact">
        <a v-if="webconfig.contact" :href="'tel:'+webconfig.contact"><a-icon type="mobile" /> 
            <span v-if="shownumber"> {{webconfig.contact}}</span> 
        </a>
        <a-divider type="vertical" v-if="webconfig.email"/>
        <a v-if="webconfig.email" :href="'mailto:'+webconfig.email"><a-icon type="mail" />
            <span v-if="shownumber"> {{webconfig.email}}</span> 
        </a>
        <a-divider type="vertical" v-if="webconfig.weixin"/>
        <a-popover placement="bottomRight" trigger="click" v-if="webconfig.weixin">
            <template slot="content">
            <img :src="webconfig.weixin" alt="wechat" title="wechat" style="width:150px">
            </template>
            <a-icon type="wechat" />
        </a-popover>
        <a-divider type="vertical" v-if="webconfig.linkedin"/>
        <a v-if="webconfig.linkedin" :href="webconfig.linkedin" target="_blank"><a-icon type="linkedin" /></a>
        <a-divider type="vertical" v-if="webconfig.facebook"/>
        <a v-if="webconfig.facebook" :href="webconfig.facebook" target="_blank"><a-icon type="facebook" /></a>
        <a-divider type="vertical" v-if="webconfig.twitter"/>
        <a v-if="webconfig.twitter" :href="webconfig.twitter" target="_blank"><a-icon type="twitter" /></a>
    </div>
</template>
<script>
  export default {
    name: 'Contact',
    data () {
        const locale = this.$store.state.locale;
        const locales = this.$store.state.locales;
        return {
            webconfig: locales.length?this.$store.state.common[locale].webconfig: this.$store.state.common.webconfig
        }
    },
    props:{
        shownumber: {
            type: Boolean,
            default: false
        },
    }
  };
</script>
<style lang="less" scoped>
    .contact,
    .contact a
    {
        color: rgba(0, 0, 0, 0.45);
        :hover{
            color: #00cccc;
        }
    }
    .ant-divider, .ant-divider-vertical{
        margin: 0 4px;
    }

</style>