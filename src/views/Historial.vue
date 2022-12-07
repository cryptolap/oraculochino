<template>
  <v-container>
    <div style="height: 60vh" v-show="procesando_consultas">
      <v-layout row align-center justify-center fill-height>
        <v-card flat color="rgba(0,0,0,0)">
          <v-icon>fas fa-sync fa-spin</v-icon>
          <v-card-text>Cargando...</v-card-text>
        </v-card>
      </v-layout>
    </div>

    <div v-show="!procesando_consultas">  
    <v-layout row xs10 sm8 md6 mb-2 align-baseline>
      <span class="title" style="color: #ADC0CB">&nbsp;&nbsp;&nbsp;&nbsp;Consultas Realizadas</span>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn flat dark icon v-on="on">
            <v-icon color="light_gray">fas fa-list</v-icon>
          </v-btn>
        </template>

        <v-list id="tarjeta" class="black_gray" dense>
          <v-list-tile
            v-for="(rango,i) in rangos" :key="i"
            @click="ordenarConsultas(rango.id)">
                <v-list-tile-title v-text="rango.cuando"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-layout>

      <v-list two-line subheader id="tarjeta">
        <v-subheader>&nbsp;&nbsp;{{ rangos[rango_elegido].cuando }}</v-subheader>
        <div v-for="item in consultas_ordenadas" :key="item.id">
          <v-list-tile avatar @click="displayConsult(item.id)">
            <v-list-tile-avatar>
              <HexaIcono :indice="item.indice" color="#F9AA33" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.pregunta }}</v-list-tile-title>
              <v-list-tile-sub-title >{{ formatearFecha(item.createTimestamp) }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">fas fa-chevron-right</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider />
        </div>
      </v-list>
    </div>

  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import HexaIcono from "@/components/HexaIcono";
import isNil from "lodash";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"
dayjs.extend(isBetween)

export default {
  components: { HexaIcono },
  data() {
    return {
      procesando_consultas: false,
      rangos: [
        { id: 0, cuando: "Hoy" },
        { id: 1, cuando: "Ayer" },
        { id: 2, cuando: "Esta Semana" },
        { id: 3, cuando: "Este Mes" },
        { id: 4, cuando: "El Mes Pasado" },
        { id: 5, cuando: "Este Año" },
        { id: 6, cuando: "El Año Pasado" },
        { id: 7, cuando: "Todas" }
      ],
      rango_elegido: 7,
      consultas_ordenadas: null
    };
  },
  computed: {
    ...mapGetters("consultas", ["getConsultas", "areConsultasDescargadas"]),
    ...mapState("usuarios", ["user"]),
    ...mapGetters("iching", ["hexagramasCargados", "getFuente", "getIdioma"]),
    ...mapGetters("usuarios", ["isUserLoggedIn"])
  },
  created() {
    //Por si entran directo a esta vista (/history) se cargan los hexagramas
    this.cargarHexas({ source: this.getFuente, lang: this.getIdioma });
  },
  mounted() {
    this.descargueConsultas();
  },
  methods: {
    ...mapActions("iching", ["crearRespuesta", "cargarHexas"]),
    ...mapActions("consultas", ["getUserConsults","displayConsult","guardeConsultasOrganizadas"]),
    
    formatearFecha(fecha, locale) {
        isNil(locale)? locale = 'es': locale = 'en'
        let str = dayjs(fecha).locale(locale).format('dddd, MMMM DD, YYYY - h:mm:ss A')
        return str.charAt(0).toUpperCase() + str.slice(1)
    },
    descargueConsultas() {
      if (this.isUserLoggedIn) {

        this.procesando_consultas = true
        if (!this.areConsultasDescargadas) {      
          console.log("Descargando consultas...")
          try {
            this.getUserConsults().then(() => {
              this.ordenarConsultas(0) //Muestre las de hoy
              this.procesando_consultas = false
              console.log("consultas descargadas desde Fbase")    
            })
          } catch (err) {
            console.error(err.message)
            this.procesando_consultas = false
          }
        } else {
          this.ordenarConsultas(7) //Muestre todas
          this.procesando_consultas = false
        }

      } else 
        this.$router.replace("/check-login");
    },

    ordenarConsultas(cuando) {
        
        this.consultas_ordenadas = []
        this.rango_elegido = cuando
        let hoy = dayjs().startOf('day')
        let ayer = hoy.subtract(1,'day')
        let inicio_semana = dayjs().startOf('week')
        let inicio_mes = dayjs().startOf('month')
        let mes_pasado = inicio_mes.subtract(1,'month')
        let inicio_ano = dayjs().startOf('year')
        let ano_pasado = inicio_ano.subtract(1,'year')

        this.getConsultas.forEach(el => {
            let fecha_consulta = el['createTimestamp']

            switch (cuando) {
                case 0: //Hoy
                    if( dayjs(fecha_consulta).isAfter(hoy) )
                        this.consultas_ordenadas.push(el)
                break

               case 1: //'Ayer':
                    if( dayjs(fecha_consulta).isBetween(ayer,hoy) )
                        this.consultas_ordenadas.push(el)
                break

                case 2: // 'Esta Semana':
                    if( dayjs(fecha_consulta).isAfter(inicio_semana) )
                        this.consultas_ordenadas.push(el)
                break

                case 3: //'Este Mes':
                    if( dayjs(fecha_consulta).isAfter(inicio_mes) )
                        this.consultas_ordenadas.push(el)
                break

                case 4: //'El Mes Pasado':
                    if( dayjs(fecha_consulta).isBetween(mes_pasado,inicio_mes) )
                        this.consultas_ordenadas.push(el)
                break

                case 5: //'Este Año':
                    if( dayjs(fecha_consulta).isAfter(inicio_ano) )
                        this.consultas_ordenadas.push(el)
                break

                case 6: //'El Año Pasado':
                    if( dayjs(fecha_consulta).isBetween(ano_pasado,inicio_ano) )
                        this.consultas_ordenadas.push(el)
                break

                default: 
                    this.consultas_ordenadas.push(el)
            }
        }) 

        this.consultas_ordenadas.sort(this.compareValues('createTimestamp','desc'))
        this.guardeConsultasOrganizadas(this.consultas_ordenadas)
    },

    compareValues(key, order = "asc") {
      return function(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }

        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    },

    // verDetalle(id, vec, preg) {
    //   this.procesando_consultas = true;
    //   try {
    //     this.$store.commit("consultas/setPregunta", preg);
    //     this.$store.commit("consultas/setId", id);
    //     this.crearRespuesta({ vector: vec, historial: true }).then(() => {
    //       this.procesando_consultas = false;
    //       this.$router.push("/ask");
    //     });
    //   } catch (err) {
    //     console.error(err.message);
    //     this.procesando_consultas = false;
    //   }
    // }
  }
};
</script>

<style scoped>
</style>

