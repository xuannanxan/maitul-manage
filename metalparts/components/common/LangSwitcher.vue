<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-03-22 21:03:01
 * @LastEditTime: 2020-03-22 22:23:52
 * @LastEditors: Xuannan
 -->
<template>
  <span class="lang-switcher">
    <NuxtLink v-if="$i18n.locale === defaultLocale" :to="'/'+$t('lang.code') + $route.fullPath" exact>
      <a-button>{{ $t('lang.name') }}</a-button>
    </NuxtLink>
    <NuxtLink v-else :to="$route.fullPath.replace(/^\/[^\/]+/, '')" exact>
      <a-button>{{ $t('lang.name') }}</a-button>
    </NuxtLink>
  </span>
</template>
 
<script>
import {i18n}  from "@/config"
export default {
  name: "LangSwitcher",
  data() {
    return {
      defaultLocale:i18n.locale
    }
  },
};
</script>
