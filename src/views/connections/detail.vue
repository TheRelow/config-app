<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <h1>{{port}}</h1>
    <button class="x-row__item" @click="connectionToPort">
      fc4
    </button>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "detail",
  data: () => ({
    port: null
  }),
  async beforeCreate() {
    this.port = await this.$route.params.port
  },
  computed: {
    portData() {
      return this.$store.state.connections[this.port]
    }
  },
  methods: {
    connectionToPort() {
      let request = {
        port: this.portData.port,
        baudRate: this.portData.baudRate,
        databits: this.portData.databits,
        parity: this.portData.parity,
        stopbits: this.portData.stopbits,
        timeout: 1000, // optional
        protocol: "RTU",
        address: this.portData.address,
        data: [
          {
            // FC4 "Read Input Registers"
            type: "FC4",
            address: 40000,
            length: 1
          },
        ]
      }
      ipcRenderer.send("ui-request", request);
    },
  }
}
</script>

<style scoped>

</style>