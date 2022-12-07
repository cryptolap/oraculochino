<template>
  <v-flex mt-2>
    <LanzarMonedas v-if="tirandoMonedas"></LanzarMonedas>
    <Oraculo v-else></Oraculo>
  </v-flex>
</template>

<script>
  import LanzarMonedas from "../components/LanzarMonedas.vue";
  import Oraculo from "../components/Oraculo.vue";
  import { mapActions, mapState, mapGetters } from 'vuex'

  export default {
    components: {
      LanzarMonedas,
      Oraculo  
    },
    methods: {
        ...mapActions('iching',['cargarHexas'])
    },
    computed: {
          ...mapGetters('iching',['tirandoMonedas','getFuente','getIdioma']),
          //...mapState('app',['fuenteHexagramas','idioma'])
    },
    created () {
        //Se carga la BD de hexagramas desde Firebase o desde Json, y en ES(pañol) o EN(glish)
        this.cargarHexas({ source: this.getFuente, lang: this.getIdioma });
    },
    data () {
        return {
            // fuente: process.env.FUENTE_HEXAGRAMAS,
            // idioma: this.$vuetify.lang.current
        }
    }
  }
</script>