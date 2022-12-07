<template>
  <v-app id="inspire" dark>
      <!-- <v-navigation-drawer app temporary>Menú</v-navigation-drawer> -->

      <v-toolbar app scroll-off-screen :scroll-threshold="75" color="rgba(52, 73, 85, 0.48)">
        <v-toolbar-title class="headline">
              <span text-uppercase>I CHING </span>
              <span class="caption font-weight-light"> El Oráculo Chino de los Cambios</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>

            <v-btn flat to="/coins" v-if="isUserLoggedIn">
              <span class="mr-2">234</span>
              <v-icon color="dark_yellow">fas fa-coins</v-icon>
            </v-btn>

      </v-toolbar>

      <v-content class="fondo">
        <transition name="fade" mode="out-in">
            <router-view :key="$route.fullPath" />        
        </transition>
      </v-content>
      
      <!-- <v-footer app /> -->
          
      <v-bottom-nav app v-if="isUserLoggedIn"
        :active.sync="activeBtn"
        :value="showNav"
        color="black_gray"
      >
      
        <v-btn small flat color="dark_yellow" to="/help">
          <v-icon small>fas fa-question-circle</v-icon>
        </v-btn>

        <v-btn small flat color="dark_yellow" to="/history">
          <v-icon small>fas fa-history</v-icon>
        </v-btn>

        <v-btn flat color="dark_yellow" @click="nuevaConsulta">
          <v-icon>fas fa-book</v-icon>
        </v-btn>

        <v-btn small flat color="dark_yellow" to="/account">
          <v-icon small>fas fa-coins</v-icon>
        </v-btn> 

            <v-btn small flat @click="logout" v-if="isUserLoggedIn && networkOnLine" color="dark_yellow">      
              <v-avatar size="17" v-if="this.$store.state.usuarios.user.photoURL">
                <img :src="this.$store.state.usuarios.user.photoURL" :alt="this.$store.state.usuarios.user.displayName">
              </v-avatar>
              <v-icon small v-else>fas fa-user</v-icon>
            </v-btn>
        
      </v-bottom-nav>

  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Login from './views/Login';
import firebase from "firebase/app";
import { isNil } from 'lodash'

export default {
  name: 'App',
  components: {
    Login, firebase
  },
  methods: {
    async logout() {
      await firebase.auth().signOut().then(() => {
        this.$router.replace('/login')
      })
    },
    nuevaConsulta() {
      this.$store.commit('iching/NUEVA_CONSULTA');
      this.$router.replace('/ask')
    }
  },
  computed: {
    ...mapGetters('usuarios',['isUserLoggedIn'])
  },
  data () {
    return {
      ...mapState('app',['networkOnLine']),
      activeBtn: 2,
      showNav: true
    }
  }
}

</script>

<style>

#tarjeta {
  transform: translateY(0px); 
  background-color: rgba(52, 73, 85, 0.48); 
  border-color: rgba(52, 73, 85, 0.48);
  border-radius: 20px 5px 10px 5px;
}

.fondo {
  background-image: url("../public/img/iching_bg_1920x1080.jpg");
  background-position-x: -50vw;
  background-size: 150vw 100vh;
  background-color: black;  
}

#inspire {
  height: 100vh;
  background: none;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
