<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-18 09:57:31
 * @LastEditTime: 2020-03-03 13:01:03
 * @LastEditors: Xuannan
 -->
<template>
  <a-empty class="error">
    <span slot="description">
      <h1 style="color:#ccc">{{error.statusCode?error.statusCode:500}}</h1>
      <h1 v-if="error.statusCode === 404">Sorry! Page Not Found</h1>
      <h2 v-else>Sorry! Server Connection Failed</h2>
      <p>Please contact us at <a href="mailto:admin@maitul.com">admin@maitul.com</a></p>
      <p><nuxt-link to="/">Go Home</nuxt-link></p>
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