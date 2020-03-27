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
        // Get locale from params
            //判断语言
    const defaultLocale = app.i18n.fallbackLocale
    const locale = params.lang || defaultLocale
    //开始初始化数据
    const cache  = new LRU({	
      max: 100, // 缓存队列长度	
      maxAge: 1000 * 60 // 缓存时间	
    })	
    let data = {}
    if (cache.has('siteData')) {	
      // 存在缓存，使用缓存数据	
      data = cache.get('siteData')	
      data = JSON.parse(data)	
      initData(data)
    } else {
      if(store.state.webconfig && Object.keys(store.state.webconfig).length===0){
        store.dispatch('_siteData').then(res=>{
          if(res.status === 200) {
            data = res.data
            initData(data)
            cache.set('siteData', JSON.stringify(data))
          }
          else{
            console.log(res.status+':'+res.message)
            //return error({ message: res.msg?res.msg:'', statusCode: res.status?res.status:500 })
          }
        })
        .catch(err=>{
          console.log(err)
        })
      }
    }
    const initData = (data)=>{
      if(Object.keys(data).length>0){
        store.commit('setAdspace',data.adspace)
        store.commit('setContent',data.content)
        store.commit('setWebconfig',data.lang.length?data.common[locale].webconfig:data.common.webconfig)
        store.commit('setCategory',data.lang.length?data.common[locale].category:data.common.category)
        store.commit('setTags',data.lang.length?data.common[locale].tags:data.common.tags)
        store.commit('setLang',data.lang.length?data.lang:[])
      }
    }
  }
