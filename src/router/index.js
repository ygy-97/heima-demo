import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
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
    component: () => import(/* webPackChunk:"home-login" */ '../views/home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import(/* webPackChunkName:"home-login" */ '../components/welcome.vue')
      },
      {
        path: '/users',
        component: () => import(/*webPackChunkName:"user"*/ '../components/user.vue')
      },
      {
        path: '/roles',//角色列表
        component: () => import(/*webPackChunkName:"user"*/ '../components/power/roles.vue')
      },
      {
        path: '/rights',//权限列表
        component: () => import(/*webPackChunkName:"user"*/ '../components/power/right.vue')
      },
      {
        path: '/goods',//商品列表
        component: () => import(/*webPackChunkName:"goods"*/ '../components/goods/goodlist.vue'),
      },
      {
        path: '/goods/addgood',
        component: () => import(/*webPackChunkName:"goods"*/ '../components/goods/addgood.vue')
      },
      {
        path: '/categories',//商品分类
        component: () => import(/*webPackChunkName:"goods"*/ '../components/goods/goodkid.vue')
      },
      {
        path: '/params',//商品分类参数
        component: () => import(/*webPackChunkName:"goods"*/ '../components/goods/goodparams.vue')
      },
      {
        path: '/orders',//订单管理
        component: () => import(/*webPackChunkName:"order"*/ '../components/orders.vue')
      },
      {
        path: '/reports',//数据报表
        component: () => import(/*webPackChunkName:"order"*/ '../components/reports.vue')
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
