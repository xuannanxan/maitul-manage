<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-02-27 00:16:56
 * @LastEditors: Xuannan
 -->
<template>
    <div class="footer"> 
      <a-row>
        <a-col :xs='24' :sm='24' :md='14' :lg='14' :xl='14'>
          <a-menu
          mode="inline"
          >
          <a-menu-item :key="'home'">
            <nuxt-link to="/" ><a-icon type="home" />home</nuxt-link>
          </a-menu-item>
          <template v-for="item in category">
            <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
              <nuxt-link :to="{path:'/list/'+item.id}"><a-icon :type="item.icon" />{{item.name}}</nuxt-link>
            </a-menu-item>
            <sub-menu v-else :menu-info="item" :key="item.id" />
          </template>
          </a-menu>
        </a-col>
        <a-col :xs='24' :sm='24' :md='10' :lg='10' :xl='10'>
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
            <div class="contact-info">
              <div style="font-size:.8rem">
                <span v-if="webconfig.address">
                    <a-icon type="environment"/> {{webconfig.address}}
                </span>
              </div>
              <div class="email">
                <a v-if="webconfig.email" :href="'mailto:'+webconfig.email">
                    <span>{{webconfig.email}}</span> 
                </a>
              </div>
              <div style="font-size:1.2rem;">
                <Contact/>
              </div>
            </div>

        </a-col>
        <a-col :span="24">
           {{webconfig.siteFoot?webconfig.siteFoot:'Maitul.com'}}
        </a-col>
      </a-row>
    </div>
</template>
<script>
  import SubMenu from './SubMenu.vue'
  import Contact from './Contact.vue'
  import {mapState} from 'vuex'
  export default {
    components:{SubMenu,Contact},
    name: 'Footer',
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

  };
</script>
<style lang="less" >
  .footer{
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.65) 58%, rgba(0, 0, 0, 0.70) 40%);
    padding: 4rem 5rem;
    .logo{
      margin-left: 4rem;
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
    .contact-info{
      margin-left: 4rem;
      font-size: 1rem;
      text-align: left;
      color: #fff;
      .email{
        font-size: 1.5rem;
        font-weight: 400;
      }
      a,i{
        color: #fff;
        :hover{
          color: #00cccc;
        }
      }
     .contact{
       a{
        color: #fff;
      }
     }
    }
    .ant-menu {
      background-color: #fff0;
    }
  }
@media only screen and (max-width:750px),
only screen and (max-device-width:750px) {
  .footer{
    padding: 2rem .5rem;
    background-color: rgba(0, 0, 0, 0.65);
    .logo{
      margin-left: 0;
      text-align: center;
      padding: 1rem 0;
    }
  }
}
</style>