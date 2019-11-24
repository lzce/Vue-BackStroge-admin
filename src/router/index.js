import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'

import Rights from '../components/Rights.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Goods from '../components/Goods.vue'
import GoodsAdd from '../components/GoodsAdd.vue'
import Categories from '../components/Categories.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    component: Index,
    children: [
      { path: 'users', component: Users },
      { path: 'roles', component: Roles },
      { path: 'rights', component: Rights },
      { path: 'goods', component: Goods },
      { path: 'goods-add', component: GoodsAdd },
      { path: 'categories', component: Categories }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 解决 vue-router 多次点击错误问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 定义导航前置守卫, 拦截登录, 进行校验, 如果没有token 则强制跳转到 login
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
