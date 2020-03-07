<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-07 18:56:43
 * @LastEditors: Xuannan
 -->
<template>
    <a-layout-header class="header">
      <a-row>
        <a-col :xs='21' :sm='21' :md='21' :lg='8' :xl='6'>
          <div class="logo">
              <nuxt-link to="/">
                <img 
                v-if="webconfig.siteLogo" 
                :src="webconfig.siteLogo" 
                :alt="webconfig.siteName?webconfig.siteName:'Qz-n'"
                :title="webconfig.siteName?webconfig.siteName:'Qz-n'">
                <img 
                v-else
                src="~assets/images/logo.png" 
                :alt="webconfig.siteName?webconfig.siteName:'Qz-n'"
                :title="webconfig.siteName?webconfig.siteName:'Qz-n'">
              </nuxt-link> 
              <a-divider type="vertical" />
              <nuxt-link to="/">
                <div class="title">
                  <div>{{webconfig.siteName?webconfig.siteName:'Qz-n blog'}}</div>
                  <span> {{webconfig.siteSlogan?webconfig.siteSlogan:'This is Qz-n blog'}}</span>
                </div>
                
              </nuxt-link> 
            </div>
          
        </a-col>     
        <a-col :xs='0' :sm='0' :md='0' :lg='10' :xl='12'>
          <a-menu
            mode="horizontal"
            :defaultSelectedKeys="currentCategory"
            class="menu"
            :selectedKeys="currentCategory"
          >
          <a-menu-item :key="'home'">
            <nuxt-link to="/" ><a-icon type="home" :style="{ fontSize: '18px'}" />首页</nuxt-link>
          </a-menu-item>
          <template v-for="item in category">
            <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
              <nuxt-link :to="{path:'/list/'+item.id}"><a-icon :type="item.icon" :style="{ fontSize: '18px'}"/>{{item.name}}</nuxt-link>
            </a-menu-item>
            <sub-menu v-else :menu-info="item" :key="item.id" />
          </template>
          </a-menu>
        </a-col>
        <a-col :xs='0' :sm='0' :md='0' :lg='5' :xl='5' :offset="1">
          <a-input-search size="large" placeholder="Search..." @search="onSearch" />
        </a-col>
        <a-col :xs='3' :sm='3' :md='3' :lg='0' :xl='0' >
          <a-button icon="menu" @click="showDrawer"></a-button>
           <a-drawer
            placement="right"
            :closable="false"
            @close="onClose"
            :visible="visible"
          >
            <a-menu
            mode="inline"
            :defaultSelectedKeys="currentCategory"
            :selectedKeys="currentCategory"
            >
            <a-menu-item :key="'home'">
              <nuxt-link to="/" ><a-icon type="home" />首页</nuxt-link>
            </a-menu-item>
            <template v-for="item in category">
              <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
                <nuxt-link :to="{path:'/list/'+item.id}"><a-icon :type="item.icon" />{{item.name}}</nuxt-link>
              </a-menu-item>
              <sub-menu v-else :menu-info="item" :key="item.id" />
            </template>
            </a-menu>
          </a-drawer>
        </a-col>
      </a-row>
    </a-layout-header>
</template>
<script>
  import SubMenu from './SubMenu.vue'
  import {mapState} from 'vuex'
  export default {
    components:{SubMenu},
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
  .header{
    position:fixed;
    z-index:99;
    width: 100%;
    .logo{
      float: left;
      img{
        width: 2.5rem;
      }
      .title {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        line-height: 180%;
        div{
          font-size: 1.6rem;
        }
        span{
          color: rgba(0, 0, 0, 0.45);
          font-size: .8rem;
        }
      }
    }
    .menu{
      float: right;
      line-height: 62px;
      font-size: 1.2rem;
    }
    
  }

</style>