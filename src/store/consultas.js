
import UserConsultsDB from '@/firebase/user-consults-db'
import router from '@/router'

export default {
    namespaced: true,

    state: {
        consults: [],
        consultToCreate: '',
        consultDeletionPending: [],
        consultCreationPending: false,
        consulta_mostrada: undefined,
        consultas_descargadas: false,
        consultas_organizadas: []
    },


    mutations: {
        /* Consult input name */
        setConsultToCreate: (state, consultToCreate) =>
            (state.consultToCreate = consultToCreate),

        /* Consults */
        setConsults: (state, consults) => (state.consults = consults),
        addConsult: (state, consult) => state.consults.push(consult),
        removeConsultById: (state, consultId) => {
            const index = state.consults.findIndex(consult => consult.id === consultId)
            state.consults.splice(index, 1)
        },

        /* Consults deletion */
        addConsultDeletionPending: (state, consultId) =>
            state.consultDeletionPending.push(consultId),
        removeConsultDeletionPending: (state, consultId) => {
            const index = state.consults.findIndex(consult => consult.id === consultId)
            state.consultDeletionPending.splice(index, 1)
        },

        /* Consult creation */
        setConsultCreationPending: (state, value) =>
            (state.consultCreationPending = value),

        // /* Una vez se organizan las consultas por fecha se sobreescriben en la variable consults */
        GUARDE_CONSULTAS_ORGANIZADAS: (state, value) =>
            (state.consultas_organizadas = value),
             
        /* Flag para cuando se descargan todas las consultas de un usuario */
        CONSULTAS_DESCARGADAS: (state, value) =>
            (state.consultas_descargadas = value),

        /* Establecer datos de la consulta que se está mostrando */
        SET_CONSULTA_MOSTRADA: (state, value) =>
        (state.consulta_mostrada = value),

    }, 


    actions: {
        /**
         * Fetch consults of current loggedin user
         */
        getUserConsults: async ({ rootState, commit }) => {
            const userConsultDb = new UserConsultsDB(rootState.usuarios.user.id)

            const consults = await userConsultDb.readAll()
            commit('setConsults', consults)
            commit('CONSULTAS_DESCARGADAS',true)
        },

        /**
         * Create a consult for current loggedin user
         */
        createUserConsult: async ({ commit, rootState }, consult) => {
            const userConsultDb = new UserConsultsDB(rootState.usuarios.user.id)

            commit('setConsultCreationPending', true)
            const createdConsult = await userConsultDb.create(consult)
            commit('addConsult', createdConsult)
            commit('setConsultCreationPending', false)
        },

        /**
         * Create a new consult for current loggedin user and reset consult name input
         */
        triggerAddConsultAction: ({ dispatch, state, commit }) => {
            if (state.consultToCreate === '') return

            const consult = { name: state.consultToCreate }
            commit('setConsultToCreate', '')
            dispatch('createUserConsult', consult)
        },

        /**
         * Delete a user consult from its id
         */
        deleteUserConsult: async ({ rootState, commit, getters }, consultId) => {
            if (getters.isConsultDeletionPending(consultId)) return

            const userConsultsDb = new UserConsultsDB(rootState.usuarios.user.id)

            commit('addConsultDeletionPending', consultId)
            await userConsultsDb.delete(consultId)
            commit('removeConsultById', consultId)
            commit('removeConsultDeletionPending', consultId)
        },

        /**
         * Muestra el detalle de una consulta a partir de su ID
         */
        displayConsult: async ({ commit, getters, dispatch }, consultId) => {
            try {
                let consulta = getters.getConsultById(consultId)
                commit("SET_CONSULTA_MOSTRADA", consulta)
                await dispatch("iching/crearRespuesta",{ vector: consulta.vector, historial: true }, {root:true}).then(() => {
                router.push("/ask")
             })
            } catch (err) {
              console.error(err.message)
            }
          },

          guardeConsultasOrganizadas: ({ commit }, payload) => {
            try {commit("GUARDE_CONSULTAS_ORGANIZADAS", payload)}
            catch (err) {console.error(err.message) }     
          }
    }, 


    getters: {
        /**
         * Check if a consult has deletion pending
         */
        isConsultDeletionPending: state => consultId =>
            state.consultDeletionPending.includes(consultId),

        /**
         * Get consult by id
         */
        getConsultById: state => consultId =>
            //find(state.consults, consult => consult.id === consultId),
            state.consults.find(consult => consult.id === consultId),

        getPregunta: state => state.actual_pregunta,

        getConsultas: state => state.consults,

        getConsultasOrganizadas: state => state.consultas_organizadas,
        
        areConsultasDescargadas: state => state.consultas_descargadas

    }
}