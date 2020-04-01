/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:14:21
 * @LastEditTime: 2020-03-29 12:41:04
 * @LastEditors: Xuannan
 */
export default {
    initData(state,{data,locale}){
        if(data && Object.keys(data).length){
            state.siteData = data
            state.adspace = data.adspace
            state.content = data.content
            state.webconfig = data.lang.length?data.common[locale].webconfig:data.common.webconfig
            state.category = data.lang.length?data.common[locale].category:data.common.category
            state.tags = data.lang.length?data.common[locale].tags:data.common.tags
            state.lang = data.lang.length?data.lang:[]
        }
    },

    setRelatedList(state,data) {
        if(data && data.length){
            state.relatedList = data
        }
    },
 
    setToken(state, token) {
        state.token = token
     },
   
    setLocale (state, locale) {
        if (state.locales.includes(locale)) {
          state.locale = locale
        }
      },
  }