import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import History from '../components/History'
import firebase from "firebase";

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { 
        requiresAuth: true 
      }
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: { 
        requiresAuth: true 
      }
    },
    {
      path: '*',
      redirect: { 
        name: 'dashboard'
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = null
  if (firebase.auth().currentUser) currentUser = firebase.auth().currentUser.email
  else if (localStorage.getItem('user')) currentUser = localStorage.getItem('user')
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (to.fullPath === '/login' && currentUser) next('dashboard')
  if (requiresAuth && !currentUser) next('login')
  else next()
})

export default router
