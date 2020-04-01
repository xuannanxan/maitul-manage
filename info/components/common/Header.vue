<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-04-01 15:46:01
 * @LastEditors: Xuannan
 -->
<template>
    <div> 
      <a-row>
        <a-col>
          <div class="topbar">
            <a-col :xs='0' :sm='0' :md='8' :lg='10' :xl='12'>
               <nuxt-link :to="{path:'/'+locale}"><span>{{webconfig.siteSlogan?webconfig.siteSlogan:$t("lang.siteName")}}</span></nuxt-link>
            </a-col>
            <a-col :xs='12' :sm='12' :md='0' :lg='0' :xl='0'>
               <nuxt-link :to="{path:'/'+locale}"><span>{{webconfig.siteName?webconfig.siteName:$t("lang.siteName")}}</span></nuxt-link>
            </a-col>
            <a-col :xs='0' :sm='0' :md='12' :lg='10' :xl='10'>
              <contact-btn :shownumber="true"/>
            </a-col>
            <a-col :xs='12' :sm='12' :md='4' :lg='4' :xl='2'>
              <LangSwitcher/>
            </a-col>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-affix :offsetTop="0">
        <a-layout-header class="header">
          <a-col :xs='21' :sm='21' :md='8' :lg='6' :xl='4'>
            <div class="logo">
              <nuxt-link :to="{path:'/'+locale}">
                <img 
                v-if="webconfig.siteLogo" 
                :src="webconfig.siteLogo" 
                :alt="webconfig.siteName?webconfig.siteName:$t('lang.siteName')"
                :title="webconfig.siteName?webconfig.siteName:$t('lang.siteName')">
                <img 
                v-else
                src="~assets/images/logo.png" 
                :alt="webconfig.siteName?webconfig.siteName:$t('lang.siteName')"
                :title="webconfig.siteName?webconfig.siteName:$t('lang.siteName')">
              </nuxt-link> 
              <a-divider type="vertical" />
              <nuxt-link :to="{path:'/'+locale}">
                <div class="title">
                  {{webconfig.siteName?webconfig.siteName:$t('lang.siteName')}}
                </div>
              </nuxt-link> 
            </div>
          </a-col>     
          <a-col :xs='0' :sm='0' :md='12' :lg='14' :xl='14' style="text-align:right">
            <a-menu
              mode="horizontal"
              :defaultSelectedKeys="currentCategory"
              class="menu"
              :selectedKeys="currentCategory"
            >
            <a-menu-item :key="'home'">
              <nuxt-link :to="{path:'/'+locale}" ><a-icon type="home" :style="{ fontSize: '16px'}"/>{{$t('lang.home')}}</nuxt-link>
            </a-menu-item>
            <template v-for="item in category">
              <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
                <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/'+item.id}"><a-icon v-if="item.icon" :type="item.icon" :style="{ fontSize: '16px'}"/>{{item.name}}</nuxt-link>
              </a-menu-item>
              <sub-menu v-else :menu-info="item" :locale="locale" :key="item.id" />
            </template>
            </a-menu>
          </a-col>
          <a-col :xs='0' :sm='0' :md='0' :lg='0' :xl='5' :offset="1">
            <a-input-search size="large" placeholder="Search..." @search="onSearch" />
          </a-col>
          <a-col :xs='0' :sm='0' :md='1' :lg='1' :xl='0' :offset="1">
            <a-popover placement="bottomRight" trigger="click">
              <template slot="content">
                <a-input-search size="large" placeholder="Search..." @search="onSearch" />
              </template>
              <a-button icon="search"></a-button>
            </a-popover>
          </a-col>
          <a-col :xs='3' :sm='3' :md='0' :lg='0' :xl='0' >
            <a-button icon="menu" @click="showDrawer"></a-button>
            <a-drawer
              placement="right"
              :closable="false"
              @close="onClose"
              :visible="visible"
            >
              <a-input-search size="large" placeholder="Search..." @search="onSearch" />
              <a-divider/>
              <a-menu
              mode="inline"
              :defaultSelectedKeys="currentCategory"
              :selectedKeys="currentCategory"
              >
              <a-menu-item :key="'home'">
                <nuxt-link to="/" ><a-icon type="home" />{{$t('lang.home')}}</nuxt-link>
              </a-menu-item>
              <template v-for="item in category">
                <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
                  <nuxt-link :to="{path:'/'+locale+'/'+item.module+'/'+item.id}"><a-icon :type="item.icon" />{{item.name}}</nuxt-link>
                </a-menu-item>
                <sub-menu v-else :menu-info="item" :locale="locale" :key="item.id" />
              </template>
              </a-menu>
              <a-divider/>
              <div style="text-align:center"><contact-btn/></div>
            </a-drawer>
          </a-col>
        </a-layout-header>
        </a-affix>
      </a-row>
    
    </div>
</template>
<script>
  import SubMenu from './SubMenu.vue'
  import ContactBtn from './ContactBtn.vue'
  import LangSwitcher from './LangSwitcher.vue'
  import {i18n}  from "@/config"
  export default {
    components:{SubMenu,ContactBtn,LangSwitcher},
    name: 'Header',
    data () {
      return {
        visible: false,
        locale:this.$i18n.locale,
        webconfig: this.$store.state.webconfig,
        category:this.$store.state.category,
      }
    },
    methods: {
        onSearch(value) {
            this.$router.push('/'+this.$i18n.locale+'/search?search='+value)    
        },
        showDrawer() {
          this.visible = true;
        },
        onClose() {
          this.visible = false;
        },
    },
    props:['currentCategory']
  };
</script>
<style lang="less" scoped>
  .topbar {
    border-bottom: 1px solid #eee;
    line-height: 30px;
    text-align: right;
    font-size: 14px;
    background-color: #f6f6f6;
    padding: 0 5rem;
    span{
      float: left;
      color: rgba(0, 0, 0, 0.55);
    }
  }
  .header{
    z-index:99;
    width: 100%;
    .logo{
      float: left;
      img{
        width: 2.5rem;
      }
      .title {
        color: #00cccc;
        font-size: 1.8rem;
        position: relative;
        top: -0.06em;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .menu{
      line-height: 62px;
      font-size: 1.1rem;
    }
  }

</style>