<template>
<v-container grid-list-md>
    <v-layout row wrap justify-center>
        <v-flex xs12 sm10 md8>
        
        <section v-if="!nueva_consulta">

            <v-card id="tarjeta" class="light_gray">         
            <v-card-title primary-title>
                <div class="subheading" style="color: black">
                {{ this.consulta_mostrada.pregunta }}
                </div>
                <div class="caption" style="color: black">
                {{ formatearFecha(this.consulta_mostrada.createTimestamp) }}
                </div>
            </v-card-title>  
            </v-card>

        </section>

        <v-card id="tarjeta">         
          <v-card-title primary-title>
              <span>
              <v-avatar>
                  <HexaIcon :indice="indice" name="indice" color="#F9AA33" />
              </v-avatar>  
              <span class="subheading">{{ hexagramas[indice].titulo }}</span>
              </span>
          </v-card-title>  
              
          <v-card-text>
              {{ hexagramas[indice].texto }}
          </v-card-text>
        </v-card>

        <section id="seccion-complementaria" v-if="lineas_moviles.length > 0">
            
            <v-card id="tarjeta">
                <v-card-title primary-title>
                    Líneas que mutan:
                </v-card-title>
                <v-expansion-panel id="tarjeta" expand>
                    <v-expansion-panel-content class="dark_gray"
                        v-for="(linea, i) in lineas_moviles" :key="i">
                        <template v-slot:header>
                        <div>Línea {{ linea.slice(0,1) }}</div>
                        </template>
                        <v-card id="tarjeta"> 
                        <v-card-text>{{ linea.substr(2,linea.length) }}</v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card>

            <v-card id="tarjeta">
            <v-card-title primary-title>
                <v-avatar>
                <HexaIcon :indice="indice_mutado" :name="indice_mutado" color="#F9AA33" />   
              </v-avatar>  
                {{ hexagramas[indice_mutado].titulo }}
            </v-card-title>  
            <v-card-text>
                {{ hexagramas[indice_mutado].texto }}
            </v-card-text>
            </v-card>    
        </section>
        
        <!-- <section id='reflexion'>
            <v-card id="tarjeta">
                <h5 class="mt-4">Pregunta de Reflexión</h5>
                <h3>{{hexagramas[indice].id}}</h3>
            </v-card>
        </section>         -->

        
        <div v-if="nueva_consulta">
            <v-layout column align-center mt-2>     
            <v-card id="tarjeta" max-width="500px" width="80vw" transition="fade" v-if="hacer_pregunta">
                <v-container>
                    <v-textarea background-color="dark_gray"
                    v-model="pregunta"
                    id="pregunta" name="pregunta"
                    label="¿Cuál fue tu pregunta?" 
                    :success="exito"
                    :messages="msg"
                    ></v-textarea>
                </v-container>
            </v-card>
                <v-btn round 
                @click="guardarConsulta()" 
                color="dark_yellow" 
                class="primary--text font-weight-bold"
                :loading="loading"
                :disabled="loading"
                > 
                {{titulo_boton}} </v-btn>           
            </v-layout>
        </div>
        <div v-else>
            <v-layout row justify-space-between mt-2 align-center>
                <v-icon medium color="dark_yellow" @click="verOtraConsulta('atras')">fas fa-chevron-left</v-icon> 
                <v-btn round 
                @click="eliminarConsulta(consulta_mostrada.id)" 
                color="dark_yellow" 
                class="primary--text font-weight-bold"
                :loading="loading"
                :disabled="loading"
                > 
                Eliminar esta Consulta </v-btn>  
                <v-icon medium color="dark_yellow" @click="verOtraConsulta('adelante')">fas fa-chevron-right</v-icon>   
            </v-layout>
        </div>
              

        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { isNil } from 'lodash'
import dayjs from "dayjs"
import HexaIcon from '@/components/HexaIcono'

export default {
    name: "Oraculo",
    components: { HexaIcon },
    data() {
        return {     
            hacer_pregunta: false,
            pregunta: null,
            titulo_boton: 'Guardar Consulta',
            loading: false,
            exito: false,
            msg: ""
        }
    },
    computed: {
        ...mapState('iching',['hexagramas','indice','indice_mutado','lineas_moviles','tirando_monedas','nueva_consulta']),    
        ...mapState('consultas',['consults','consulta_mostrada']),
        ...mapGetters('consultas',['getConsultasOrganizadas'])
   },
    methods: {
        ...mapActions('consultas',['createUserConsult','deleteUserConsult','displayConsult']),
        formatearFecha(fecha, locale) {
            isNil(locale)? locale = 'es': locale = 'en'
            let str = dayjs(fecha).locale(locale).format('dddd, MMMM DD, YYYY - h:mm:ss A')
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        guardarConsulta() {
            if(isNil(this.pregunta)){
                this.hacer_pregunta = true
                this.titulo_boton = "Guardar"
            }
            else{
                this.loading = true
                const consult_obj = {
                    pregunta: this.pregunta,
                    vector: this.$store.state.iching.vector,
                    indice: this.indice,
                    indiceMutado: this.indice_mutado,
                    respuesta: this.hexagramas[this.indice].titulo
                }
                //console.log(consult_obj)
                this.createUserConsult(consult_obj).then(() => {
                    this.exito = true
                    this.msg = "Consulta Guardada"
                    this.loading = false
                    this.$router.push('/history')
                }).catch(err => {
                    this.loading = false
                    this.msg = err.message
                })

            }
        },

        eliminarConsulta(id) {
            
            if (confirm('¿Está seguro de querer eliminar esta consulta?')) {
                this.loading = true
                this.deleteUserConsult(id).then(() => {
                    this.exito = true
                    this.msg = "Consulta Eliminada"
                    this.loading = false
                    this.$router.push('/history')
                }).catch(err => {
                    this.loading = false
                    this.msg = err.message
                })
            }

        },

        verOtraConsulta(sentido) {
            let index = this.getConsultasOrganizadas.findIndex(i => i.id === this.consulta_mostrada.id)
            sentido == 'atras'? index += 1 : index -= 1
            let cons = this.getConsultasOrganizadas[index]
            if(!isNil(cons))
                this.displayConsult(cons.id)
        }
    }
}
</script>

<style scoped>

</style>
