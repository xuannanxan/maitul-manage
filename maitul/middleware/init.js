/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-03-22 19:24:32
 * @LastEditTime: 2020-03-26 20:32:47
 * @LastEditors: Xuannan
 */

import LRU from 'lru-cache'	

export default function({ isHMR, app, store, route, params, error, redirect }) {
    // If middleware is called from hot module replacement, ignore it
    if (isHMR) return
    //开始初始化数据
    const cache  = new LRU({	
      max: 100, // 缓存队列长度	
      maxAge: 1000 * 60 // 缓存时间	
    })	
    if (cache.has('siteData')) {	
      // 存在缓存，使用缓存数据	
      let data = cache.get('siteData')	
      data = JSON.parse(data)	
      store.commit('setAdspace',data.adspace?data.adspace:{})
      store.commit('setContent',data.content?data.content:{})
      store.commit('setCommon',data.common?data.common:{})
      store.commit('setLang',data.lang.length?data.lang:[])
    } else {
      if(store.state.common && Object.keys(store.state.common).length===0){
        store.dispatch('_siteData').then(res=>{
          if(res.status === 200) {
            let data = res.data
            cache.set('siteData', JSON.stringify(data))
            store.commit('setAdspace',data.adspace)
            store.commit('setContent',data.content)
            store.commit('setCommon',data.common)
            store.commit('setLang',data.lang.length?data.lang:[])
          }
          else{
            return error({ message: res.msg?res.msg:'', statusCode: res.status?res.status:500 })
          }
        })
        .catch(err=>{
          console.log(err)
        })
      }
    }
  }
