<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-18 09:57:31
 * @LastEditTime: 2020-02-18 20:33:48
 * @LastEditors: Xuannan
 -->
<template>
  <a-empty class="error">
    <span slot="description">
      <h3>Sorry!</h3>
      <h1 v-if="error.statusCode === 404">页面不存在</h1>
      <h1 v-else>服务器连接失败</h1>
      <p>Please contact us at <a href="mailto:admin@maitul.com">admin@maitul.com</a></p>
      <p><nuxt-link to="/"> 返回首页</nuxt-link></p>
    </span>
  </a-empty>
</template>

<script>
  export default {
    props: ['error'],
  };
</script>
<style lang='less' scoped>
  .error{
    padding: 5rem;
    p{
      font-size: 1.2rem;
    }
  }
</style>