import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Consultar from '@/views/Consultar.vue'
import Cuenta from '@/views/Cuenta.vue'
import Historial from '@/views/Historial.vue'
import CheckLogin from '@/views/CheckLogin'
import firebase from '@firebase/app'
import { isNil } from 'lodash'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/check-login',
      name: 'check-login',
      component: CheckLogin,
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/ask',
      name: 'consultar',
      component: Consultar
    },
    {
      path: '/account',
      name: 'cuenta',
      component: Cuenta
    },
    {
      path: '/history',
      name: 'historial',
      component: Historial
    },
    {
      path: '/help',
      name: 'instrucciones',
      component: () => import(/* webpackChunkName: "chunk-help" */ '@/views/Instrucciones.vue'),
    },
    { path: '*', redirect: '/ask' },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
  
})

/**
 * Handle user redirections
 */
router.beforeEach((to, from, next) => {

  if ( !(to.meta && to.meta.authNotRequired) && 
      isNil(firebase.auth().currentUser)) {

    const path =
    firebase.auth().currentUser === null ? '/login' : '/check-login'
    return next(`${path}?redirectUrl=${to.path}`)
  }
  next()
})

export default router