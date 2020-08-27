import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import User from '../components/user.vue'
import Welcome from '../components/welcome.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/roles',//角色列表
        component: () => import('../components/power/roles.vue')
      },
      {
        path: '/rights',//权限列表
        component: () => import('../components/power/right.vue')
      },
      {
        path: '/goods',//商品列表
        component: () => import('../components/goods/goodlist.vue'),
      },
      {
        path: '/goods/addgood',
        component: () => import('../components/goods/addgood.vue')
      },
      {
        path: '/categories',//商品分类
        component: () => import('../components/goods/goodkid.vue')
      },
      {
        path: '/params',//商品分类参数
        component: () => import('../components/goods/goodparams.vue')
      },
      {
        path: '/orders',//订单管理
        component: () => import('../components/orders.vue')
      },
      {
        path: '/reports',//数据报表
        component: () => import('../components/reports.vue')
      }
    ]
  }
]


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  sessionStorage.setItem('path', to.path == '/goods/addgood' ? '/goods' : to.path)
  console.log('router', to.path)
  if (to.path === "/login") {
    return next();
  }
  const token = sessionStorage.getItem('token');
  // console.log(token)
  if (!token) {
    return next('/login')
  }
  next();
})

export default router
