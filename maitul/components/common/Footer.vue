<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-02-29 10:39:50
 * @LastEditors: Xuannan
 -->
<template>
    <div> 
      <a-row class="footer">
        <a-col :xs='24' :sm='24' :md='14' :lg='14' :xl='14'>
              <div class="nav">
                <nuxt-link to="/">
                  <a-icon type="home"/> Home
                </nuxt-link>
              </div>
              <div class="nav"  v-for="item in category" :key='item.id' >
                <nuxt-link :to="{path:item.url+item.id}">
                  <a-icon :type="item.icon"/> {{item.name}}
                </nuxt-link>
                <div v-if="item.children.length>0" v-for="child in item.children" :key='child.id' class="child-nav">
                  <nuxt-link :to="{path:child.url+child.id}">
                    <a-icon :type="child.icon"/> {{child.name}}
                  </nuxt-link>
                </div>
              </div>
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
              <a-divider style="color:#fff">Inquiry</a-divider>
              <div>
                <Message/>
              </div>
            </div>
        </a-col>

      </a-row>
      <a-row>
        <a-col :span="24" class="copyright">
            {{webconfig.siteFoot?webconfig.siteFoot:'Maitul.com'}}
        </a-col>
      </a-row>
    </div>
</template>
<script>
  import SubMenu from './SubMenu.vue'
  import Contact from './Contact.vue'
  import Message from './Message.vue'
  import {mapState} from 'vuex'
  export default {
    components:{SubMenu,Contact,Message},
    name: 'Footer',
    data() {
      return {
        visible: false,
      }
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
    padding: 3rem 5rem 1rem 5rem;
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
        font-size: 1.2rem;
        font-weight: 400;
        color: #fff;
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
    .nav{
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom:1rem; 
      a{
        color: #fff;
        padding: .3rem;
      }
      a:hover{
        border-bottom: 2px solid #00cccc;
        color:#00cccc
      }
      .child-nav{
        margin:.5rem 1.2rem; 
        font-weight: 300;
        font-size: 1rem;
      }
    }
  }
  .copyright{
    color:#fff;
    text-align:center;
    background-color: rgba(0, 0, 0, 0.62);
    padding: 1rem;
  }
@media only screen and (max-width:750px),
only screen and (max-device-width:750px) {
  .footer{
    padding: 2rem .5rem;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.65) 100%, rgba(0, 0, 0, 0.70) 0%);
    .logo{
      margin-left: 0;
      text-align: center;
      padding: 1rem 0;
    }
    .contact-info{
      margin: 0 1rem;
      }
  }
}
</style>