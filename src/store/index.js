import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const axios = require('axios').default;
// eslint-disable-next-line no-unused-vars
import { driver } from "@/modules/driver";

export default new Vuex.Store({
  state: {
    connections: {},
    registers: {},
    loading: {}
  },
  mutations: {
    // входные параметры
    // { COM4_247: { '30101': [ 9 ] } }
    setRegister (state, payload) {
      for (let fp in payload) {
        if (!state.registers[fp]) {
          Vue.set(state.registers, fp, {})
        }
        for (let i in payload[fp]) {
          Vue.set(state.registers[fp], i, payload[fp][i])
        }
      }
    },
    setConnection (state, payload) {
      Vue.set(state.connections, payload.fullPath, payload)
    },
    setLoading (state, payload) {
      Vue.set(state.loading, payload.fullPath, payload.value)
    }
  },
  actions: {
    dataTransfer ({commit}, payload) {
      commit("setLoading", {
        fullPath: payload.fullPath,
        value: true
      })
      axios.post('http://localhost:1337/data-transfer', payload)
        .then((answer)=>{
          commit("setRegister", answer.data)
          commit("setLoading", {
            fullPath: payload.fullPath,
            value: false
          })
        })
    },
    addConnection ({commit, dispatch}, payload) {
      axios.post('http://localhost:1337/new-connection', payload)
        // eslint-disable-next-line no-unused-vars
        .then((k)=>{
          commit("setConnection", payload)
          let request = {
            fullPath: payload.fullPath,
            data: driver
          }
          dispatch("dataTransfer", request)
        })
    }
  },
  getters: {
    connections: s => s.connections,
  },
})
