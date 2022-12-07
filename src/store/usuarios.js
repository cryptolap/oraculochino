import router from '@/router'
import { isNil } from 'lodash'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'
import UsersDB from '@/firebase/users-db'

export default {
    namespaced: true,

    state: {
        user: null,
        loading: false,
        error: null
      },

    mutations: {
        SET_USER(state,payload) {
          state.user = payload;
        },
        SET_LOADING (state, payload) {
          state.loading = payload
        },
        SET_ERROR (state, payload) {
          state.error = payload
        },
        CLEAR_ERROR (state) {
          state.error = null
        }
      },
      
    actions: {
        /**
         * Callback fired when user login
         */
        login: async ({ commit, dispatch }, firebaseAuthUser) => {
            const userFromFirebase = await new UsersDB().read(firebaseAuthUser.uid)

            const user = isNil(userFromFirebase)
            ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
            : userFromFirebase

            commit('SET_USER', user)
            console.log("SET_USER login...")
            //dispatch('products/getUserProducts', null, { root: true })
        },

        /**
         * Callback fired when user logout
         */
        logout: ({ commit }) => {
            commit('SET_USER', null)
            console.log("SET_USER logout...")
        }
      },

    getters: {

        isUserLoggedIn: state => !isNil(state.user),

        userData (state) {
          return state.user
        },
        isUserLoading (state) {
          return state.loading
        },
        errorData (state) {
          return state.error
        }
      }   


  }