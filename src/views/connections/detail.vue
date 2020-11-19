<template>
  <div>
    <router-link to="/connections" class="x-row__item">
      back
    </router-link>
    <button to="/connections/detail" class="x-row__item" @click="connectionToPort">
      fc4
    </button>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "detail",
  computed: {
    portData() {
      return this.$store.state.connections[0]
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