<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <h1>{{fullPath}}</h1>
    <v-btn  @click="connectionToPort"> update data </v-btn>
    <ComponentPortfolioInfo :value="portData.data"></ComponentPortfolioInfo>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import ComponentPortfolioInfo from "@/components/ComponentPortInfo";
export default {
  name: "detail",
  data: () => ({
  }),
  components: { ComponentPortfolioInfo },
  beforeCreate() {
    this.fullPath = this.$route.params.fullPath
  },
  computed: {
    portData() {
      return this.$store.state.connections[this.fullPath]
    }
  },
  methods: {
    connectionToPort() {
      console.log(this.portData)
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
        ]
      }
      ipcRenderer.send("ui-request", request);
    },
    logg() {
      console.log(this.portData)
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