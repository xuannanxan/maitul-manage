<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-03-22 21:03:01
 * @LastEditTime: 2020-03-27 16:12:21
 * @LastEditors: Xuannan
 -->
<template>
  <div class="floatRight" v-if="lang.length">
  <a-dropdown>
    <a class="ant-dropdown-link" @click="e => e.preventDefault()"> {{locale}} <a-icon type="down" /> </a>
    <a-menu slot="overlay">
      <a-menu-item  v-for="item in lang" :key="item.ename">
        <NuxtLink :to="'/'+item.ename" exact>
          <p>{{item.name}}</p>
        </NuxtLink>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
  </div>
</template>
 
<script>
import {i18n}  from "@/config"
export default {
  name: "LangSwitcher",
  data () {
    return {
      defaultLocale:i18n.locale,
      lang: this.$store.state.lang,
      locale:''
    }
  },
  created(){
        this.lang.forEach(item => {
          if(item.ename === this.$i18n.locale){
            this.locale = item.name
          }
        });
  }
};
</script>
