<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-02-28 13:45:36
 * @LastEditors: Xuannan
 -->
<template>
    <div>
          
      <a-row>
        <a-col :xs='0' :sm='0' :md='24' :lg='24' :xl='24'>
          <div class="topbar">
            <a-col :span="12">
               <nuxt-link to="/"><span>{{webconfig.siteName?webconfig.siteSlogan:'Maitul.com'}}</span></nuxt-link>
            </a-col>
            <a-col :span="12">
              <Contact :shownumber="true"/>
            </a-col>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-affix :offsetTop="0">
        <a-layout-header class="header">
          <a-col :xs='21' :sm='21' :md='6' :lg='4' :xl='4'>
            <div class="logo">
              <nuxt-link to="/">
                <img 
                v-if="webconfig.siteLogo" 
                :src="webconfig.siteLogo" 
                :alt="webconfig.siteName?webconfig.siteName:'MT'"
                :title="webconfig.siteName?webconfig.siteName:'MT'">
                <img 
                v-else
                src="~assets/images/logo.png" 
                :alt="webconfig.siteName?webconfig.siteName:'MT'"
                :title="webconfig.siteName?webconfig.siteName:'MT'">
              </nuxt-link> 
              <a-divider type="vertical" />
              <nuxt-link to="/">
                <div class="title">
                  {{webconfig.siteName?webconfig.siteName:'Maitul'}}
                </div>
              </nuxt-link> 
            </div>
          </a-col>     
          <a-col :xs='0' :sm='0' :md='14' :lg='16' :xl='14' style="text-align:right">
            <a-menu
              mode="horizontal"
              :defaultSelectedKeys="currentCategory"
              class="menu"
              :selectedKeys="currentCategory"
            >
            <a-menu-item :key="'home'">
              <nuxt-link to="/" ><a-icon type="home" />Home</nuxt-link>
            </a-menu-item>
            <template v-for="item in category">
              <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
                <nuxt-link :to="{path:item.url+item.id}"><a-icon :type="item.icon" />{{item.name}}</nuxt-link>
              </a-menu-item>
              <sub-menu v-else :menu-info="item" :key="item.id" />
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
                <nuxt-link to="/" ><a-icon type="home" />Home</nuxt-link>
              </a-menu-item>
              <template v-for="item in category">
                <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
                  <nuxt-link :to="{path:item.url+item.id}"><a-icon :type="item.icon" />{{item.name}}</nuxt-link>
                </a-menu-item>
                <sub-menu v-else :menu-info="item" :key="item.id" />
              </template>
              </a-menu>
              <a-divider/>
              <div style="text-align:center"><Contact/></div>
            </a-drawer>
          </a-col>
        </a-layout-header>
        </a-affix>
      </a-row>
    
    </div>
</template>
<script>
  import SubMenu from './SubMenu.vue'
  import Contact from './Contact.vue'
  import {mapState} from 'vuex'
  export default {
    components:{SubMenu,Contact},
    name: 'Header',
    data() {
      return {
        visible: false,
      }
    },
    methods: {
        onSearch(value) {
            this.$router.push('/list?search='+value)    
        },
        showDrawer() {
          this.visible = true;
        },
        onClose() {
          this.visible = false;
        },
    },
    computed:{
      ...mapState(["webconfig"]),
      ...mapState(["category"]),
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