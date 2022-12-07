import { isNil } from 'lodash'

export default {
    namespaced: true,

    state: {
        hexagramas: null,
        hexagramas_cargados: false,
        tirando_monedas: true,
        vector: [],
        vector_mutado: [],
        indice: "",
        indice_mutado: "",
        lineas_moviles: [],
        nueva_consulta: true
      },

    mutations: {
        LOAD_HEXAS(state, hex_data) {
          state.hexagramas = hex_data;
        },
        HEXAS_LOADED(state, value) {
          state.hexagramas_cargados = value
        },
        SET_VECTORES(state, vector) {
          state.vector = state.vector_mutado = [];
          state.indice = state.indice_mutado = "";
          state.lineas_moviles = [];
          state.vector = vector;
          let v = [];
          vector.forEach(el => v.push(el % 2));
          state.indice = v.join("");
        },
        MUTAR_VECTORES(state, vector) {
          vector.forEach(valor => {
            if (valor === 6) state.vector_mutado.push(7 % 2);
            else if (valor === 9) state.vector_mutado.push(8 % 2);
            else state.vector_mutado.push(valor % 2);
          });
          state.indice_mutado = state.vector_mutado.join("");
        },
        SET_LINEAS(state, vector) {
            vector.forEach((valor, i) => {
              //console.log(this.hexagramas);
              valor == 6 || valor == 9
                ? state.lineas_moviles.push(
                    state.hexagramas[state.indice].lineas[i + 1]
                  )
                : null
            });
        },
        MOSTRAR_ORACULO(state) {
          state.tirando_monedas = false        
        },
        OCULTAR_ORACULO(state) {
          state.tirando_monedas = true        
        },
        CAMBIE_ESTADO_ORACULO(state) {
          state.tirando_monedas = !state.tirando_monedas
          
        },
        CONSULTA_GUARDADA(state){
          state.nueva_consulta = false
        },
        CAMBIE_ESTADO_CONSULTA(state){
          state.nueva_consulta = !state.nueva_consulta
        },
        NUEVA_CONSULTA(state) {
          state.nueva_consulta = true;
          state.tirando_monedas = true;
        }
      },
      
    actions: {
        cargarHexas( { commit, getters }, payload) {
          if (!getters.hexagramasCargados) {
            console.log(`Cargando Hexagramas - Source: ${payload.source} - Idioma: ${payload.lang}`);
            if (payload.source === "firebase") {
              let ruta = "/hexagramas/" + payload.lang.toUpperCase() + "/";
              db.ref(ruta)
                .once("value")
                .then(snapshot => {
                  let listado = snapshot.val();
                  //console.log(listado);
                  commit("LOAD_HEXAS", listado);
                  commit("HEXAS_LOADED",true)
                });
            } else {
              //abro el archivo JSON
              fetch("/db/iching_db.json")
                .then(res => res.json())
                .then(db => {
                  let listado = db.hexagramas[payload.lang];
                  commit("LOAD_HEXAS", listado);
                  commit("HEXAS_LOADED",true)
                });
            }
          }
        },

        crearRespuesta ( { commit }, payload) {
          
          const v = payload.vector
          commit("SET_VECTORES", v)
          if (v.some(elem => elem == 6) || v.some(elem => elem == 9)){ // hay lineas moviles
            commit("SET_LINEAS", v)
            commit("MUTAR_VECTORES", v)
          }
           
          if(!isNil(payload.historial)){
            commit("CONSULTA_GUARDADA")
            commit("MOSTRAR_ORACULO")
          }
          else
            commit("CAMBIE_ESTADO_ORACULO")
        }
      },

    getters: {
      tirandoMonedas (state) {
        return state.tirando_monedas
      },
      hexagramasCargados: state => state.hexagramas_cargados,

      esNuevaConsulta: state => state.nueva_consulta,

      getIdioma (state,getters,rootState) {
          return rootState.app.idioma
        },
      getFuente (state,getters,rootState) {
        return rootState.app.fuenteHexagramas
      }
      }   


  }