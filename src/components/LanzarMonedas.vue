<template>
<v-container grid-list-md v-if="tirando_monedas">
    <v-layout row align-center justify-center fill-height fluid>
        <v-flex xs12 sm10 md8 lg6>
            <v-card id="tarjeta">

                
            <v-tabs centered icons-and-text color="black_gray">
                <v-tabs-slider centered color="light_yellow"></v-tabs-slider>
                <v-tab href="#tab-1">
                    Virtual
                    <span><v-icon>fab fa-gg-circle</v-icon> <v-icon small>fas fa-random</v-icon> <v-icon>far fa-life-ring</v-icon></span>
                </v-tab>
                <v-tab href="#tab-2">
                    Manual
                    <span><v-icon small>fas fa-database</v-icon><v-icon>fas fa-hand-paper</v-icon></span>
                </v-tab>

                <v-tab-item value="tab-1"> <!-- Pestaña 1 -->
                    
                    <v-container text-xs-center>
                        <!-- El componente Tiradas muestra las lineas del hexagrama a medida que se hacen los lanzamientos: -->
                        <Tiradas :v_tmp="v_tmp"></Tiradas>

                        <v-layout row justify-center>
                            <v-flex mt-4> 
                                <v-btn round large color="dark_yellow" class="primary--text font-weight-bold" @click="lanzarMonedas()">
                                    {{ botonCaption }}
                                </v-btn>
                            </v-flex>
                        </v-layout>

                    </v-container>
                   
                </v-tab-item>

                <v-tab-item value="tab-2"> <!-- Pestaña 2 -->
                   <v-container text-xs-center>
                         <Tiradas :v_tmp="v_tmp"></Tiradas>

                        <v-layout row v-if="v_tmp.length<6">
                             
                            <v-flex xs7 md6 md mt-3 pt-3 text-xs-right>
                                <v-card-text class="dark_yellow--text font-weight-bold text-uppercase">{{botonCaption}}:</v-card-text>
                            </v-flex>
                            <v-flex xs2 md3 mt-3>
                                <v-select 
                                    color="dark_yellow"
                                    :items="tiradas"
                                    v-model.number="tiradaManual"
                                    @input="lanzarMonedas('tiradaManual')"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                        <v-layout v-else>    
                            <v-flex mt-4>
                                <v-btn
                                round large color="dark_yellow" class="primary--text font-weight-bold" @click="lanzarMonedas()">
                                    {{ botonCaption }}
                                </v-btn>
                            </v-flex>
                        </v-layout>

                    </v-container>
                </v-tab-item>

            </v-tabs>

            </v-card>
        </v-flex>
    </v-layout>

                            

</v-container>
</template>



<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Tiradas from './Tiradas';

export default {
name: "LanzarMonedas",
components: {
    Tiradas
  },
computed: {
    ...mapState('iching',['tirando_monedas'])
},
  methods: {
      ...mapActions('iching',['crearRespuesta']),
    lanzarMonedas(tirada) {
        let valor = "";
        tirada
        ?   valor = this.tiradaManual
        :   valor = this.getRandom(6, 9);

        if (this.counter < 6) {
            this.v_tmp.push(valor);
            this.counter++;
            this.counter == 6
            ? (this.botonCaption = "Ver Respuesta")
            : (this.botonCaption = `Lanzamiento ${this.counter + 1}`);
        } else {
            //ESTE ES EL MOMENTO CLAVE EN QUE SE DA CLICK A "VER RESPUESTA"
            this.crearRespuesta({vector: this.v_tmp})
            this.v_tmp = [];
            this.counter = 0;
            this.tiradaManual = "";
      }
    },
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  data() {
		return {
			counter: 0,
            botonCaption: "Lanzamiento 1",
            v_tmp: [],
            tiradas: [6,7,8,9],
            tiradaManual: ""
        }
  }
};
</script>

<style scoped>
</style>