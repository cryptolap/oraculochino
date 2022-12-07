<template>
  <v-container text-xs-center>
    <div style="height: 70vh" v-show="validatingUser">
        <v-layout row align-center justify-center fill-height>
          <v-card flat color="rgba(0,0,0,0)">
            <v-icon>fas fa-sync fa-spin</v-icon>
            <v-card-text>Autenticando...</v-card-text>
          </v-card>
        </v-layout>
    </div>
  
    <div style="height: 70vh" v-show="!netStatus">
        <v-layout row align-center justify-center fill-height>
          <v-card flat color="rgba(0,0,0,0)">
              <v-icon>fas fa-wifi</v-icon>
            <v-card-text>Se requiere de conexión a Internet para ingresar a consultar el I Ching</v-card-text>
          </v-card>
        </v-layout>
    </div>

    <div v-show="!usuarioLogueado && netStatus && !validatingUser">
    <v-layout row v-if="loginError">
      <v-flex xs12 sm6 offset-sm3 >
        <v-alert type="error" outline dismissible @input="loginError = null" :value="true">{{ loginError }}</v-alert>        
      </v-flex>
    </v-layout>

    <v-layout row v-if="loginSuccess">
      <v-flex xs12 sm6 offset-sm3 >
        <v-alert type="success" outline dismissible @input="loginSuccess = null" :value="true">{{ loginSuccess }}</v-alert>        
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card id="tarjeta" elevation-15>
          <v-card-text>
            <v-container>
              Estado de la red: {{netStatus}} <br>
              Estado del usuario: {{usuarioLogueado}}
              <form ref="loginForm" @submit.prevent="login('firebase')">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field outline
                      name="email"
                      label="Correo Electrónico"
                      id="email"
                      v-model="email"
                      type="email"
                      :rules="[rules.required, rules.email]"
                      required
                      background-color="dark_gray"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field outline v-if="suiche!='cambiar_clave'"
                      name="password"
                      label="Contraseña"
                      id="password"
                      v-model="password"
                      type="password"
                      autocomplete="current-password"
                      required counter 
                      background-color="dark_gray"></v-text-field>

                      <v-text-field outline v-if="suiche=='crear_usuario'"
                      name="password"
                      label="Confirmar Contraseña"
                      id="password2"
                      v-model="password2"
                      type="password"
                      :rules="[rules.required]"
                      required counter 
                      :error-messages="passMatchError"
                      background-color="dark_gray"></v-text-field>
                      <!-- <v-icon>fas fa-check</v-icon> -->
                  </v-flex>
                </v-layout>
                
                <v-layout column>
                  <v-flex xs12 mb-4>
                    <v-btn color="dark_yellow" class="primary--text font-weight-bold" type="submit">
                      {{ tituloBoton }}                     
                    </v-btn>
                   </v-flex> 
                  <v-divider />
                </v-layout>

                 <v-layout row wrap >
                  <v-flex xs12 md8 offset-md2>

                      <v-switch label=" Crear Cuenta" v-model="suiche" value="crear_usuario" color="dark_yellow" height="10"></v-switch>
                      <v-switch label=" ¿Olvidó su Contraseña?" v-model="suiche" value="cambiar_clave" color="dark_yellow" height="10"></v-switch>
              
                  </v-flex>                 
                </v-layout>

              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    
    <v-layout wrap justify-center>
      <v-flex xs12 sm4 mt-2>  
        <v-btn light color="white_yellow"
            
            data-test="login-btn"
            @click="login('fb')"
            >
            <v-icon color="info">fab fa-facebook</v-icon>&nbsp;
            Ingresar con Facebook
        </v-btn>
      </v-flex>

      <v-flex xs12 sm4 mt-2>  
        <v-btn light color="white_yellow"
            
            data-test="login-btn"
            @click="login('google')"
            >
            <v-icon color="red">fab fa-google</v-icon>&nbsp;
            Ingresar con Google
        </v-btn>
      </v-flex>
    </v-layout>
    </div>

  </v-container>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { isNil } from 'lodash'
import firebase from 'firebase/app'
import { desktop as isDekstop } from 'is_js'

  export default {
    data () {
      return {
        email: null, 
        password: null, password2: null,
        loginError: null,
        loginSuccess: null,
        validatingUser: false,
        suiche: null,
        rules: {
          required: value => !!value || 'Requerido',
          counter: value => value.length > 5 || 'Mínimo 6 caracteres',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Correo Incompleto'
          }
        }
      }
    },
    head: function() {
        return {
            title: {
                inner: 'I CHING | Login'
            },
            meta: [
                {
                name: 'description',
                content: `Ingresar o Registrarse en ${this.appTitle}`,
                id: 'desc'
                }
            ]
        }
    },
    computed: {   
        ...mapState('usuarios', ['user']),
        ...mapState('app', ['appTitle']),
        ...mapGetters('app',['netStatus']),
        usuarioLogueado (){
          return !isNil(firebase.auth().currentUser)
        },
        tituloBoton () {
          let texto
          if (this.suiche == "crear_usuario")
            texto = " Registrarse "
          else if (this.suiche == "cambiar_clave")
            texto = "Restablecer Contraseña"
          else 
            texto = " Ingresar "

          return texto
        },
        passMatchError () { 
          return (this.password === this.password2) ? '' : 'Las Contraseñas no Coinciden'
        }
        
    },
    watch: {
        user: {
        handler(user) {
            if (!isNil(user)) {            
            this.validatingUser = false // La variable "user" del LocalStore ya se llenó con la info del Provider, entonces se quita la pantalla de "Autenticando..."
            const redirectUrl = isNil(this.$route.query.redirectUrl)
                ? '/ask'
                : this.$route.query.redirectUrl
            this.$router.push(redirectUrl)
            }
        },
        immediate: true
        }
    },
    methods: {
        ...mapMutations('usuarios',['SET_USER']),
        async login(donde) {
            this.loginError = null
            this.validatingUser = true
            this.SET_USER(undefined)
            if(donde == 'firebase'){
              if (this.suiche == 'crear_usuario') { // crear nueva cuenta
                try {
                    await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                      .then( () => {
                        this.validatingUser = false
                        this.suiche = null
                        this.loginSuccess = "Usuario Creado Exitosamente"
                      })
                } catch (err) {
                    this.loginError = err
                    this.validatingUser = false
                    this.SET_USER(null)
                }
              }
              else if (this.suiche == 'cambiar_clave') { // enviar email para cambiar clave
                try {
                    firebase.auth().languageCode = this.$vuetify.lang.current
                    await firebase.auth().sendPasswordResetEmail(this.email)
                    .then( () => {
                      this.validatingUser = false
                      this.suiche = null
                      this.loginSuccess = "El correo para el cambio de contraseña ha sido enviado a " + this.email
                    })
                } catch (err) {
                    this.loginError = err
                    this.validatingUser = false
                    this.SET_USER(null)
                }
              }
              else {  // loguearse
                try {
                    await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                } catch (err) {
                    this.loginError = err
                    this.validatingUser = false
                    this.SET_USER(null)
                }
              }
            }
            else if (donde == 'google') {
                const provider = new firebase.auth.GoogleAuthProvider()
                console.log("se fue a Google: " + provider)
                try {
                    isDekstop()
                     ? await firebase.auth().signInWithPopup(provider)
                     : await firebase.auth().signInWithRedirect(provider)
                } catch (err) {
                    this.loginError = err
                    this.validatingUser = false
                    this.SET_USER(null)
                }
            }
            else {
                const provider = new firebase.auth.FacebookAuthProvider()
                console.log("se fue a FB: " + provider)
                try {
                    isDekstop()
                     ? await firebase.auth().signInWithPopup(provider)
                     : await firebase.auth().signInWithRedirect(provider)
                } catch (err) {
                    this.loginError = err
                    this.validatingUser = false
                    this.SET_USER(null)
                }
            }
                
        }

    }
  }
</script>


<style scoped>

</style>
