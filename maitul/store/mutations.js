/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:14:21
 * @LastEditTime: 2020-03-26 20:31:15
 * @LastEditors: Xuannan
 */
export default {
    setAdspace(state,data) {
        if(data && Object.keys(data).length){
            state.adspace = data
        }
    },

    setContent(state,data) {
        if(data && Object.keys(data).length){
            state.content = data
        }
    },

    setWebconfig(state,data) {
        if(data && Object.keys(data).length){
            state.webconfig = data
        }
    },
    setCategory(state,data) {
        if(data && data.length){
            state.category = data
        }
    },
    setTags(state,data) {
        if(data && data.length){
            state.tags = data
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

    setLang(state,data) {
        if(data && data.length){
            state.lang = data
        }
    },
  }