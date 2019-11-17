import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import element-ui
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// axiso 的全局配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// 手动安装 axios
Vue.use(elementUI)

// 清除vue 的无用console提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
