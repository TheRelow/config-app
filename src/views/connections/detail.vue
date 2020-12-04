<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <h1>{{fullPath}}</h1>
    <v-btn @click="connectionToPort"> update data </v-btn>
    <ComponentPortInfo :fullPath="this.fullPath"></ComponentPortInfo>
    <v-row justify="space-around">
      <v-date-picker
        v-model="picker"
        color="green lighten-1"
      ></v-date-picker>
    </v-row>
    {{formatedDate}}
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import ComponentPortInfo from "@/components/ComponentPortInfo";
export default {
  name: "detail",
  data: () => ({
    picker: new Date().toISOString().substr(0, 10),
  }),
  components: { ComponentPortInfo },
  beforeCreate() {
    this.fullPath = this.$route.params.fullPath
  },
  computed: {
    portData() {
      return this.$store.state.connections[this.fullPath]
    },
    formatedDate() {
      return new Date(this.picker).getTime()
    }
  },
  methods: {
    connectionToPort() {
      let request = {
        port: this.portData.port,
        fullPath: this.fullPath,
        baudRate: this.portData.baudRate,
        databits: this.portData.databits,
        parity: this.portData.parity,
        stopbits: this.portData.stopbits,
        timeout: 1000,
        protocol: "RTU",
        address: this.portData.address,
        data: [
          {
            type: "FC4",
            address: 40000,
            length: 1
          },
          {
            type: "FC3",
            address: 30000,
            length: 2
          },
          {
            type: "write",
            address: 30000,
            value: this.formatedDate
          },
          {
            type: "FC3",
            address: 30000,
            length: 2
          },
        ]
      }
      ipcRenderer.send("ui-request", request);
    }
  },
  created() {
    if (!this.portData.data) {
      this.connectionToPort();
    }
  }
}
</script>

<style scoped>

</style>
