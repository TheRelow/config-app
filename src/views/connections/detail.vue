<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <h1>{{fullPath}}</h1>
    <div v-if="!isCreated">loading...</div>
    <ComponentTableRegisters :fullPath="this.fullPath" v-else></ComponentTableRegisters>
  </div>
</template>

<script>

import ComponentTableRegisters from "@/components/ComponentTableRegisters";
export default {
  name: "detail",
  // eslint-disable-next-line vue/no-unused-components
  components: {ComponentTableRegisters},
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: '',
    pagination: {},
  }),
  beforeCreate() {
    this.fullPath = this.$route.params.fullPath
  },
  computed: {
    portData() {
      return this.$store.state.connections[this.fullPath]
    },
    portRegisters() {
      return this.$store.state.registers[this.fullPath]
    },
    isCreated() {
      return this.$store.state.created[this.fullPath]
    },
  }
}
</script>
