<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-03-22 21:03:01
 * @LastEditTime: 2020-03-26 20:38:05
 * @LastEditors: Xuannan
 -->
<template>
  <span class="lang-switcher" v-if="lang.length">
    <!-- <NuxtLink v-if="$i18n.locale === defaultLocale" :to="'/'+lang.ename + $route.fullPath" exact>
      <a-button>{{ lang.name}}</a-button>
    </NuxtLink>
    <NuxtLink v-else :to="$route.fullPath.replace(/^\/[^\/]+/, '')" exact>
      <a-button>{{lang.name}}</a-button>
    </NuxtLink> -->
    <div v-for="item in lang" :key="item.ename">
      <NuxtLink v-if="$i18n.locale === defaultLocale" :to="'/'+item.ename + $route.fullPath" exact>
        <a-button>{{ item.name}}</a-button>
      </NuxtLink>
    </div>
  </span>
</template>
 
<script>
import {i18n}  from "@/config"
export default {
  name: "LangSwitcher",
  data () {
    return {
      defaultLocale:i18n.locale,
      lang: this.$store.state.lang,
    }
  },
};
</script>
