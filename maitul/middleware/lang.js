/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-03-22 19:24:32
 * @LastEditTime: 2020-03-26 19:54:00
 * @LastEditors: Xuannan
 */

export default function({ isHMR, app, store, route, params, error, redirect }) {
    // If middleware is called from hot module replacement, ignore it
    if (isHMR) return
    //判断语言
    const defaultLocale = app.i18n.fallbackLocale
    // Get locale from params
    const locale = params.lang || defaultLocale
    if (store.state.locales.indexOf(locale) === -1) {
      return error({ message: 'This page could not be found.', statusCode: 404 })
    }
    // Set locale
    store.commit('setLocale', locale)
    app.i18n.locale = store.state.locale
    // If route is /<defaultLocale>/... -> redirect to /...
    if (locale === defaultLocale && route.fullPath.indexOf('/' + defaultLocale) === 0) {
      const toReplace = '^/' + defaultLocale + (route.fullPath.indexOf('/' + defaultLocale + '/') === 0 ? '/' : '')
      const re = new RegExp(toReplace)
      return redirect(
        route.fullPath.replace(re, '/')
      )
    }
    
  }
