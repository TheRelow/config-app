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
            data: [
              {type: "readTime"},
              {
                "address": "30101",
                "length": "1",
                "access": "rw",
                "dataType": "unit16",
                "min": "enum",
                "max": "",
                "default": "9"
              },
              {
                "address": "30102",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "min": "0.005",
                "max": "1.6",
                "default": "0.1",
                "decimal": "4"
              },
              {
                "address": "30104",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "min": "2.83",
                "max": "90560",
                "default": "283",
                "decimal": "4"
              },
              {
                "address": "30106",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "min": "0.01",
                "max": "253.57",
                "default": "0.99",
                "decimal": "4"
              },
              {
                "address": "30108",
                "access": "rw",
                "dataType": "unit16",
                "min": "enum",
                "max": "",
                "default": "0"
              },
              {
                "address": "30109",
                "length": "2",
                "access": "ro",
                "dataType": "unit32"
              },
              {
                "address": "30111",
                "length": "2",
                "access": "ro",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30113",
                "length": "2",
                "access": "rw",
                "dataType": "unit32"
              },
              {
                "address": "30115",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30117",
                "length": "2",
                "access": "rw",
                "dataType": "unit32"
              },
              {
                "address": "30119",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30121",
                "length": "2",
                "access": "rw",
                "dataType": "unit32"
              },
              {
                "address": "30123",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30125",
                "length": "2",
                "access": "rw",
                "dataType": "unit32"
              },
              {
                "address": "30127",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30129",
                "length": "2",
                "access": "rw",
                "dataType": "unit32"
              },
              {
                "address": "30131",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30133",
                "length": "2",
                "access": "rw",
                "dataType": "unit32"
              },
              {
                "address": "30135",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30137",
                "length": "2",
                "access": "rw",
                "dataType": "unit32"
              },
              {
                "address": "30139",
                "length": "2",
                "access": "rw",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30141",
                "length": "2",
                "access": "ro",
                "dataType": "unit32"
              },
              {
                "address": "30143",
                "length": "2",
                "access": "ro",
                "dataType": "float",
                "decimal": "4"
              },
              {
                "address": "30145",
                "access": "rw",
                "min": "9",
                "max": "240",
                "default": "72",
                "dataType": "unit16"
              },
              {
                "address": "30146",
                "access": "rw",
                "min": "24",
                "max": "240",
                "default": "48",
                "dataType": "unit16"
              },
            ]
          }
          dispatch("dataTransfer", request)
        })
    }
  },
  getters: {
    connections: s => s.connections,
  },
})
