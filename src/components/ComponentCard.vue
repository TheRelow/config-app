<template>
  <button class="x-row__item" @click="connectionToPort">
    {{value.item.port}}
  </button>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "ComponentCard",
  props: ['value'],
  methods: {
    connectionToPort() {
      let request = {
        port: this.value.item.port,
        baudRate: this.value.item.baudRate,
        databits: this.value.item.databits,
        parity: this.value.item.parity,
        stopbits: this.value.item.stopbits,
        timeout: 1000, // optional
        protocol: "RTU",
        address: this.value.item.address,
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