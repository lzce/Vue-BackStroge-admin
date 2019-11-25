import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// import element-ui
import elementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'

// 安装富文本
Vue.use(VueQuillEditor)
// axiso 的全局配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios 强行放到Vue构造函数的原型上
Vue.prototype.$axios = axios

// 配置axios的拦截器
axios.interceptors.request.use(function (config) {
  // 在全局配置, 发送请求请拦截, 添加Authrization
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (res) {
  // 能够拦截到 响应数据 res, 直接把 res.data给浏览器
  return res.data
}, function (error) {
  return Promise.reject(error)
})

// 手动安装 axios
Vue.use(elementUI)

// 清除vue 的无用console提示
Vue.config.productionTip = false

// 全局时间过滤器
Vue.filter('format', function (val) {
  return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
