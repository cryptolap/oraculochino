import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import usuarios from './usuarios'
import iching from './iching'
import consultas from './consultas'

Vue.use(Vuex)

/* If you don't know about Vuex, please refer to https://vuex.vuejs.org/ */

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    usuarios,
    iching,
    consultas
  }
})