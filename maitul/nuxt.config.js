/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-02 19:15:46
 * @LastEditors: Xuannan
 */
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Maitul.com',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Maitul.com' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['ant-design-vue'],
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'es', 
            // 选择子目录 例如 es 表示 ant-design-vue/es/component
            // lib 表示 ant-design-vue/lib/component
            style: true 
            // 默认不使用该选项，即不导入样式 , 注意 ant-design-vue 使用 js 文件引入样式
            // true 表示 import  'ant-design-vue/es/component/style' 
            // 'css' 表示 import 'ant-design-vue/es/component/style/css' 
          }
        ]
      ]
    },
    
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      };
      /**
       * // 自定义 ant-design-vue 主题颜色
       */
      config.module.rules.push({
        test: /\.less$/,
        use: [{
            loader: 'less-loader',
            options: {
                modifyVars: {
                    'primary-color': '#00cccc',                       // 全局主色
                    'link-color': '#00cccc',                           // 链接色
                    'success-color': '#52c41a',                        // 成功色
                    'warning-color': '#faad14',                        // 警告色
                    'error-color': '#f5222d',                           // 错误色
                    'font-size-base': '14px',                          // 主字号
                    'heading-color': 'rgba(0, 0, 0, .85)',             // 标题色
                    'text-color': 'rgba(0, 0, 0, .65)',               // 主文本色
                    'text-color-secondary' : 'rgba(0, 0, 0, .45)',      // 次文本色
                    'disabled-color' : 'rgba(0, 0, 0, .25)',           // 失效色
                    'border-radius-base': '4px',                        // 组件/浮层圆角
                    'border-color-base': '#d9d9d9',                     // 边框色
                    'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)',  // 浮层阴影
                },
                javascriptEnabled: true
            }
        }]
      })
    }
  },
  plugins: [
    {
      src: '@/plugins/antd',ssr:true
    }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'  //添加proxy模块
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    proxy: true, // 表示开启代理
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true // 表示跨域请求时是否需要使用凭证
  },

  proxy: [  //proxy配置
    ['/api', {
      target:process.env.NODE_ENV==='produce'?'http://api.maitul.com/api':'http://127.0.0.1:5000/api',  //api请求路径
      pathRewrite: { 
        '^/api' : '/' ,   // 把 /api 替换成 /
        changeOrigin: true // 表示是否跨域
      }  //重定向请求路径，防止路由、api路径的冲突
         }]
  ],

  mode: 'universal',
  env: {
    BASE_URL: process.env.BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  }
  
}

