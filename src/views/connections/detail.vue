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
// import { ipcRenderer } from "electron";
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
        fullPath: this.fullPath,
        data: [
          {
            type: "read",
            address: 30000,
            value: this.formatedDate
          },
          {
            type: "read",
            address: 30000,
            value: this.formatedDate
          },
          {
            type: "readTime"
          },
        ]
      }
      // ipcRenderer.send("ui-request", request);
      this.$store.commit("requestData", request);
    }
  },
  created() {
    if (!this.portData.data) {
      // this.connectionToPort();
    }
  }
}
</script>

<style scoped>

</style>
