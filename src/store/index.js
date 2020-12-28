import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const axios = require('axios').default;
import { driver } from "@/modules/driver";

export default new Vuex.Store({
  state: {
    connections: {},
    registers: {}
  },
  mutations: {
    // входные параметры
    // { COM4_247: { '30101': [ 9 ], date: 1608368644000 } }
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
      console.log('setConnection', payload)
      Vue.set(state.connections, payload.fullPath, payload)
    }
  },
  actions: {
    dataTransfer ({commit}, payload) {
      axios.post('http://localhost:1337/data-transfer', payload)
        .then((answer)=>{
          console.log('data-transfer', answer)
          commit("setRegister", answer.data)
        })
    },
    addConnection ({commit, dispatch}, payload) {
      axios.post('http://localhost:1337/new-connection', payload)
        .then((k)=>{
          commit("setConnection", payload)
          console.log(k)
          let request = {
            fullPath: payload.fullPath,
            data: driver
          }
          request.data.push({type: "readTime"})
          dispatch("dataTransfer", request)
        })
    }
  },
  getters: {
    connections: s => s.connections,
  },
})
