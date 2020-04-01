<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-19 14:15:19
 * @LastEditTime: 2020-03-30 13:40:24
 * @LastEditors: Xuannan
 -->
<template functional>
  <a-sub-menu :key="props.menuInfo.id">
    <span slot="title">
      <nuxt-link :to="{path:'/'+props.locale+'/'+props.menuInfo.module+'/'+props.menuInfo.id}"><a-icon v-if="props.menuInfo.icon" :type="props.menuInfo.icon" :style="{ fontSize: '16px'}"/>{{props.menuInfo.name}}</nuxt-link>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
        <nuxt-link :to="{path:'/'+props.locale+'/'+item.module+'/'+item.id}"><a-icon v-if="item.icon" :type="item.icon" :style="{ fontSize: '16px'}"/>{{item.name}}</nuxt-link>
      </a-menu-item>
      <sub-menu v-else :key="item.id" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo','locale'],
};
</script>