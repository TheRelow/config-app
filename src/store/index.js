import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connections: {},
    openedConnections: []
  },
  mutations: {
    addConnection (state, payload) {
      Vue.set(state.connections, payload.fullPath, payload)
    },
    addData (state, payload) {
      for (let i of payload.data) {
        Vue.set(state.connections[i.fullPath], 'data', i.value)
      }
    }
  },
  actions: {
  },
  getters: {
    connections: s => s.connections,
  },
})
