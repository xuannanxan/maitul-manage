/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:14:21
 * @LastEditTime: 2020-02-19 16:47:45
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
    setRightAd(state,data){
        if(data && data.length){
            state.rightAd = data
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
     }

  }