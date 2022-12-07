import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import '@/firebase/init'
import '@/firebase/authentication'
import '@/misc/register-service-worker'
import '@/misc/handle-network-status'
import '@/misc/handle-apple-install-prompt'
import 'pwacompat'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')

import '@/plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

//import '@babel/polyfill'

Vue.config.productionTip = false

//Lo siguiente es para que no muestre el login cuando se hace reload del browser, como cuando vuelve de autenticar con FB o Google
let app
firebase.auth().onAuthStateChanged( firebaseUser => {

  if(!app){
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})


