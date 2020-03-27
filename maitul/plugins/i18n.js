/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-03-22 20:06:30
 * @LastEditTime: 2020-03-27 16:15:31
 * @LastEditors: Xuannan
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {i18n}  from "@/config"
Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: i18n.locale,
    messages: {
      'en': require('@/lang/en.json'),
      'zh': require('@/lang/zh.json')
    }
  })

  app.i18n.path = (link) => {
    // 如果是默认语言，就省略
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }
    return `/${app.i18n.locale}/${link}`
  }
}