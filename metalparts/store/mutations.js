/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:14:21
 * @LastEditTime: 2020-03-19 22:33:42
 * @LastEditors: Xuannan
 */
export default {
    setWebConfig(state,data) {
        if(data && Object.keys(data).length){
            state.webconfig = data
        }
    },
    setCategory(state,data) {
        if(data && data.length){
            state.category = data
        }
    },
    setBanner(state,data){
        if(data && data.length){
            state.banner = data
        }
    },
    setArticleList(state,data){
        if(data && data.length){
            state.articleList = data
        }
    },
    setContent(state,data) {
        if(data && Object.keys(data).length){
            state.content = data
        }
    },
    setContentList(state,data) {
        if(data && data.length){
            state.contentList = data
        }
    },
    setTags(state,data) {
        if(data && data.length){
            state.tags = data
        }
    },
    setToken(state, token) {
        state.token = token
     },
    setProductList(state,data) {
        if(data && data.length){
            state.productList = data
        }
    },
    setAbout(state,data) {
        if(data && data.length){
            state.about = data
        }
    },
    setAdspace(state,data){
        if(data && Object.keys(data).length){
            state.adspace = data
        }
    },
    setLang (state, locale) {
        if (state.locales.includes(locale)) {
          state.locale = locale
        }
      }
  }