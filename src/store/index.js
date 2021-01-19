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
    loading: {},
    created: {}
  },
  mutations: {
    // входные параметры
    // { COM4_247: { '30101': [ 9 ] } }
    setRegister (state, payload) {
      console.log('setRegister', payload)
      console.log('state', state)
      for (let fp in payload) {
        if (!state.registers[fp]) {
          state.registers[fp] = []
        } else {
          // eslint-disable-next-line no-unused-vars
          let registersIndex = []
          // for (let i of state.registers[fp]) {
          //   registersIndex.push(i.address)
          // }
          // console.log('registersIndex in state', registersIndex)
          console.log('something')
        }
        let registersIndex = []
        for (let i of state.registers[fp]) {
          registersIndex.push(i.address.toString())
        }
        for (let i in payload[fp]) {
          let id = state.registers[fp].find(register => register.address.toString() === i.toString())
          if (id) {
            let registerIndex = registersIndex.indexOf(i)
            Vue.set(state.registers[fp][registerIndex], 'value', payload[fp][i])
          } else {
            state.registers[fp].push({
              address: i,
              value: payload[fp][i]
            })
          }
        }
      }
    },
    setConnection (state, payload) {
      Vue.set(state.connections, payload.fullPath, payload)
    },
    setLoading (state, payload) {
      console.log(payload)
      Vue.set(state.loading, payload.fullPath, payload.value)
    },
    setCreated (state, payload) {
      console.log(payload)
      Vue.set(state.created, payload.fullPath, payload.value)
    }
  },
  actions: {
    dataTransfer ({commit}, payload) {
      axios.post('http://localhost:1337/data-transfer', payload)
        .then((answer)=>{
          console.log(answer)
          commit("setRegister", answer.data)
          commit("setCreated", {
            fullPath: payload.fullPath,
            value: true
          })
          commit("setLoading", {
            fullPath: payload.fullPath,
            value: false
          })
        })
    },
    addConnection ({commit, dispatch}, payload) {
      commit("setCreated", {
        fullPath: payload.fullPath,
        value: false
      })
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
    register: state => options => {
      let registersIndex = []
      for (let i of state.registers[options.fullPath]) {
        registersIndex.push(i.address.toString())
      }
      let registerIndex = registersIndex.indexOf(options.register.toString())
      return state.registers[options.fullPath][registerIndex].value
    }
  },
})
