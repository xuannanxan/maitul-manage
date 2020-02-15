/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-13 22:14:21
 * @LastEditTime : 2020-02-14 22:53:51
 * @LastEditors  : Xuannan
 */
export default {
    setWebConfig(state,data) {
        if(data && Object.keys(data).length){
            state.webconfig = data
        }
    },
    setCategory(state,data) {
        if(data && Object.keys(data).length){
            state.category = data
        }
    },
    setToken(state, token) {
        state.token = token
     }

  }