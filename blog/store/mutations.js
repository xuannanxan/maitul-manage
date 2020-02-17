/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:14:21
 * @LastEditTime : 2020-02-14 22:53:51
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
    setToken(state, token) {
        state.token = token
     }

  }