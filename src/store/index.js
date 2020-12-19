import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const axios = require('axios').default;

export default new Vuex.Store({
  state: {
    connections: {},
    registers: {}
  },
  mutations: {
    dataTransfer (state, payload) {
      axios.post('http://localhost:1337/data-transfer', payload)
        .then((answer)=>{
          console.log('data-transfer', answer)
          for (let i in answer.data) {
            Vue.set(state.registers, i, answer.data[i])
          }
        })
      // Vue.set(state.connections, payload.fullPath, payload)
    },
    addConnection (state, payload) {
      axios.post('http://localhost:1337/new-connection', payload)
        .then((k)=>{
          console.log(k)
        })
      Vue.set(state.connections, payload.fullPath, payload)
    },
    addDate (state, payload) {
      axios.get('http://localhost:1337/time/' + payload.fullPath)
        .then((response)=>{
          Vue.set(state.connections[payload.fullPath], 'date', response.data)
        })
    }
  },
  actions: {
  },
  getters: {
    connections: s => s.connections,
  },
})
