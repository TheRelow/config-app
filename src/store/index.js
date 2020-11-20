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
      Vue.set(state.connections, payload.port, payload)
    }
  },
  actions: {
  },
  getters: {
    connections: s => s.connections,
  },
})
