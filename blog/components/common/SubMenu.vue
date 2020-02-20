<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-19 14:15:19
 * @LastEditTime: 2020-02-20 16:44:00
 * @LastEditors: Xuannan
 -->
<template functional>
  <a-sub-menu :key="props.menuInfo.id">
    <div slot="title">
      <nuxt-link  :to="{path:'/list/'+props.menuInfo.id}"><a-icon :type="props.menuInfo.icon" />{{props.menuInfo.name}}</nuxt-link>
    </div>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="Object.keys(item.children).length===0" :key="item.id">
        <nuxt-link :to="{path:'/list/'+item.id}"><a-icon :type="item.icon" />{{item.name}}</nuxt-link>
      </a-menu-item>
      <sub-menu v-else :key="item.id" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo'],
};
</script>
