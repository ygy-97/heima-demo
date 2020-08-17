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
  }, {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:User
      },
      {
        path:'/roles',
        component:()=> import('../components/roles.vue')
      },
      {
        path:'/rights',
        component:()=>import('../components/right.vue')
      },
    ]
  }
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  sessionStorage.setItem('path',to.path)
  if (to.path === "/login") {
    return next();
  }
  const token = sessionStorage.getItem('token');
  console.log(token)
  if (!token) {
    return next('/login')
  }
  next();
})

export default router
