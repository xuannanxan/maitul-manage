/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-05 21:37:26
 * @LastEditTime : 2020-02-11 15:24:24
 * @LastEditors  : Xuannan
 */
// const withCss = require('@zeit/next-css')

// if(typeof require !== 'undefined'){
//     require.extensions['.css']=file=>{}
// }

// module.exports = withCss({})

const withLess = require('@zeit/next-less')

module.exports =   withLess(
  {
    lessLoaderOptions: {
      javascriptEnabled: true,
      cssModules: true,

    },
    webpack: function(cfg) {
      const originalEntry = cfg.entry
      cfg.entry = async () => {
        const entries = await originalEntry()
  
        if (
          entries['main.js'] &&
          !entries['main.js'].includes('./client/polyfills.js')
        ) {
          entries['main.js'].unshift('./client/polyfills.js')
        }
  
        return entries
      }
  
      return cfg
    },
  }
)
