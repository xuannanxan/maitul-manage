<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-18 09:57:31
 * @LastEditTime: 2020-03-22 20:27:20
 * @LastEditors: Xuannan
 -->
<template>
  <div>
    <a-empty class="error">
      <span slot="description" style="color:#ccc">{{error.statusCode?error.statusCode:500}}</span>
    </a-empty>
    <div  class="error">
      <h1 v-if="error.statusCode === 404">Sorry! Page Not Found</h1>
      <h2 v-else>Sorry! Server Connection Failed</h2>
      <p>Please contact us at <a href="mailto:admin@maitul.com">admin@maitul.com</a></p>
      <p><nuxt-link to="/">Go Home</nuxt-link></p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
  };
</script>
<style lang='less' scoped>
  .error{
    padding-top: 6rem;
    font-size: 1.5rem;
    font-weight: 500;
    text-align: center;
    p{
      font-size: 1.2rem;
    }
  }
</style>